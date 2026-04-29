import { createClient } from '@/lib/supabase/server'
import AcervoGrid from '@/components/AcervoGrid'

export default async function MembroPage() {
  const supabase = await createClient()

  const { data: files } = await supabase
    .from('stl_files')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto">
      <AcervoGrid files={files || []} />
    </div>
  )
}
