'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function downloadFile(formData: FormData) {
  const fileId = formData.get('fileId') as string
  const fileUrl = formData.get('fileUrl') as string

  if (!fileId || !fileUrl) {
    throw new Error('Parâmetros inválidos')
  }

  const supabase = await createClient()

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Verify status active
  const { data: profile } = await supabase
    .from('profiles')
    .select('kiwify_status, role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.kiwify_status !== 'active' && profile.role !== 'admin')) {
    throw new Error('Acesso negado: assinatura inativa.')
  }

  // Record download history
  await supabase.from('downloads_history').insert({
    user_id: user.id,
    file_id: fileId
  })

  // Increment download counter
  const { data: fileData } = await supabase.from('stl_files').select('downloads_count').eq('id', fileId).single()
  if (fileData) {
    await supabase.from('stl_files').update({ downloads_count: fileData.downloads_count + 1 }).eq('id', fileId)
  }

  // Generate Signed URL for download
  const { data, error } = await supabase
    .storage
    .from('stl-files')
    .createSignedUrl(fileUrl, 60) // valid for 60 seconds

  if (error || !data?.signedUrl) {
    throw new Error('Não foi possível gerar o link de download.')
  }

  // Redirect user to the signed URL to trigger browser download
  redirect(data.signedUrl)
}
