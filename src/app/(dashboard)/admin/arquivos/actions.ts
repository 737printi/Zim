'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteStlFile(fileId: string, fileUrl: string, galleryUrls: string[]) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  // Extract paths from URLs
  // fileUrl: https://[project].supabase.co/storage/v1/object/public/stl-files/folder/file.stl
  // The path is everything after /public/stl-files/
  
  const extractPath = (url: string, bucket: string) => {
    try {
      const parts = url.split(`/public/${bucket}/`)
      if (parts.length > 1) {
        return parts[1]
      }
      return null
    } catch {
      return null
    }
  }

  const stlPath = extractPath(fileUrl, 'stl-files')
  const thumbnailPaths = galleryUrls.map(url => extractPath(url, 'thumbnails')).filter(Boolean) as string[]

  // Delete physical files
  if (stlPath) {
    await supabase.storage.from('stl-files').remove([stlPath])
  }
  
  if (thumbnailPaths.length > 0) {
    await supabase.storage.from('thumbnails').remove(thumbnailPaths)
  }

  // Delete DB record
  const { error } = await supabase.from('stl_files').delete().eq('id', fileId)

  if (error) {
    throw new Error('Erro ao deletar arquivo do banco: ' + error.message)
  }

  revalidatePath('/admin/arquivos')
  revalidatePath('/membro/acervo')
  revalidatePath('/membro')
  return { success: true }
}
