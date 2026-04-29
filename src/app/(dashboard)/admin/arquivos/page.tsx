import { createClient } from '@/lib/supabase/server'
import { Plus, Box } from 'lucide-react'
import Link from 'next/link'
import ArquivoActions from '@/components/ArquivoActions'

export default async function AdminArquivosPage() {
  const supabase = await createClient()

  const { data: files } = await supabase
    .from('stl_files')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--color-zim-border)] pb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Gerenciar Arquivos STL</h1>
          <p className="text-[var(--color-zim-muted)] text-sm">Faça upload, edite ou remova modelos 3D do acervo.</p>
        </div>
        
        <Link 
          href="/admin/arquivos/novo"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,95,31,0.2)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Arquivo
        </Link>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)]">
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-[var(--color-zim-border)]">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Arquivo</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Downloads</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-zim-border)]">
              {files && files.length > 0 ? (
                files.map((file) => (
                  <tr key={file.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-[var(--color-zim-border)] overflow-hidden shrink-0">
                          {file.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={file.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Box className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{file.title}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-xs">{file.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-medium text-zinc-300">
                        {file.category || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-300 font-medium">{file.downloads_count}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArquivoActions 
                        fileId={file.id} 
                        fileUrl={file.file_url} 
                        galleryUrls={file.gallery_urls || []} 
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    Nenhum arquivo cadastrado. Clique em "Novo Arquivo" para adicionar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
