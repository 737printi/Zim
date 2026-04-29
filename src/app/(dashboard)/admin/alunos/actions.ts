'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelUserSubscription(userId: string) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from('profiles')
    .update({ kiwify_status: 'canceled' })
    .eq('id', userId)

  if (error) {
    throw new Error('Falha ao cancelar assinatura: ' + error.message)
  }

  revalidatePath('/admin/alunos')
  return { success: true }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  const adminClient = createAdminClient()

  // Delete from Auth. This cascades to public.profiles because of ON DELETE CASCADE
  const { error } = await adminClient.auth.admin.deleteUser(userId)

  if (error) {
    throw new Error('Falha ao deletar usuário: ' + error.message)
  }

  revalidatePath('/admin/alunos')
  return { success: true }
}
