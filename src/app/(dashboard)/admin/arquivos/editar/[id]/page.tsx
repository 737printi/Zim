import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function EditarArquivoPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Fetch file
  const { data: file } = await supabase
    .from('stl_files')
    .select('*')
    .eq('id', id)
    .single()

  if (!file) {
    redirect('/admin/arquivos')
  }

  async function updateFile(formData: FormData) {
    'use server'
    const supabaseServer = await createClient()
    
    // Verify Admin
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    await supabaseServer
      .from('stl_files')
      .update({ title, description, category })
      .eq('id', id)

    revalidatePath('/admin/arquivos')
    revalidatePath('/membro/acervo')
    revalidatePath('/membro')
    redirect('/admin/arquivos')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-[var(--color-zim-border)] pb-6">
        <Link 
          href="/admin/arquivos"
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Editar Modelo</h1>
          <p className="text-[var(--color-zim-muted)] text-sm">Altere as informações do arquivo STL.</p>
        </div>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)] overflow-hidden">
        <form action={updateFile} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-zinc-300">
              Título do Modelo
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={file.title}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-[var(--color-zim-border)] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-semibold text-zinc-300">
              Categoria
            </label>
            <input
              type="text"
              id="category"
              name="category"
              defaultValue={file.category || ''}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-[var(--color-zim-border)] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-zinc-300">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={file.description || ''}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-[var(--color-zim-border)] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] focus:border-transparent transition-all resize-none"
            />
          </div>
          
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-[var(--color-zim-border)]">
            <p className="text-xs text-zinc-500 text-center">
              Nota: Para alterar as imagens ou o arquivo STL, você precisa excluir este modelo e fazer o upload novamente.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--color-zim-border)]">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-4 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,95,31,0.2)]"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
