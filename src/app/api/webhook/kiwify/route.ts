import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    // 1. Verify Kiwify Webhook Secret (if configured)
    const url = new URL(req.url);
    const signature = url.searchParams.get('signature'); 
    // In production, Kiwify sends a signature or token. For now, let's just check our custom query parameter or header
    // Some folks use a custom token in the webhook URL: /api/webhook/kiwify?token=SUPER_SECRET
    const token = url.searchParams.get('token') || req.headers.get('x-kiwify-signature');
    const secret = process.env.KIWIFY_WEBHOOK_SECRET;

    if (secret && token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const event = body.order_status || body.subscription_status || body.event; 
    const email = body.Customer?.email || body.customer?.email || body.email;

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Mapping Kiwify events to our status
    let targetStatus: 'active' | 'inactive' | 'canceled' | 'overdue' | 'refunded' | null = null;
    let shouldCreateAccount = false;

    // Based on Kiwify docs, the main events are:
    switch (event) {
      case 'paid':
      case 'approved':
      case 'active':
        targetStatus = 'active';
        shouldCreateAccount = true;
        break;
      case 'refunded':
        targetStatus = 'refunded';
        break;
      case 'canceled':
        targetStatus = 'canceled';
        break;
      case 'overdue':
      case 'late':
        targetStatus = 'overdue';
        break;
      case 'reactivated':
        targetStatus = 'active';
        break;
      default:
        // Other events (e.g. waiting_payment) we might not care about for access control
        console.log(`Ignored event: ${event}`);
        return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    // Process user creation/update
    if (shouldCreateAccount) {
      // Check if user exists
      const { data: existingProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, kiwify_status')
        .eq('email', email)
        .limit(1);

      if (profileError) throw profileError;

      if (!existingProfiles || existingProfiles.length === 0) {
        // Create new user using Supabase Admin
        // inviteUserByEmail automatically sends an email to set the password
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);
        
        if (inviteError) {
          console.error("Error inviting user:", inviteError);
          throw inviteError;
        }

        const userId = inviteData.user.id;

        // Profile is automatically created by the Postgres trigger we set up.
        // We just need to update their status.
        await supabase
          .from('profiles')
          .update({ kiwify_status: targetStatus })
          .eq('id', userId);

      } else {
        // User exists, just update their status
        await supabase
          .from('profiles')
          .update({ kiwify_status: targetStatus })
          .eq('id', existingProfiles[0].id);
      }
    } else if (targetStatus) {
      // Just update status for existing user (for cancellations, refunds, etc.)
      await supabase
        .from('profiles')
        .update({ kiwify_status: targetStatus })
        .eq('email', email); // We can update by email since it's unique
    }

    return NextResponse.json({ success: true, message: `Processed ${event} for ${email}` });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
