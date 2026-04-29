import { createClient } from '@/lib/supabase/server'
import { History, File, Calendar } from 'lucide-react'

export default async function AdminDownloadsPage() {
  const supabase = await createClient()

  // Fetch full log of downloads
  const { data: logs } = await supabase
    .from('downloads_history')
    .select(`
      id,
      downloaded_at,
      profiles ( email, kiwify_status ),
      stl_files ( title, category )
    `)
    .order('downloaded_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[var(--color-zim-border)] pb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Log de Downloads</h1>
        <p className="text-[var(--color-zim-muted)] text-sm">Registro completo de todos os arquivos baixados pelos alunos.</p>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-[var(--color-zim-border)]">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Data do Download</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Arquivo Baixado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-zim-border)]">
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        {new Date(log.downloaded_at).toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{log.profiles?.email}</span>
                        <span className="text-xs text-zinc-500">Status: {log.profiles?.kiwify_status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-[var(--color-zim-orange)]" />
                        <span className="text-sm font-medium text-[var(--color-zim-orange)] hover:underline cursor-pointer">
                          {log.stl_files?.title}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                    Ainda não há registros de download.
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
