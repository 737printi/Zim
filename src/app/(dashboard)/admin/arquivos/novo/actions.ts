'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function saveFileMetadata(data: {
  title: string
  description: string
  category: string
  thumbnailUrl: string | null
  galleryUrls: string[]
  fileUrl: string
}) {
  const supabase = await createClient()

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Forbidden')

  // Insert to DB
  const { error } = await supabase.from('stl_files').insert({
    title: data.title,
    description: data.description,
    category: data.category,
    thumbnail_url: data.thumbnailUrl,
    gallery_urls: data.galleryUrls,
    file_url: data.fileUrl, // Path inside the bucket
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/arquivos')
  revalidatePath('/membro')
  
  return { success: true }
}
