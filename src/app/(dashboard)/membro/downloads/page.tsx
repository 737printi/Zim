import { createClient } from '@/lib/supabase/server'
import { Download, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function MeusDownloadsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: logs } = await supabase
    .from('downloads_history')
    .select(`
      id,
      downloaded_at,
      stl_files ( id, title, category, thumbnail_url )
    `)
    .eq('user_id', user?.id)
    .order('downloaded_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-[var(--color-zim-border)] pb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Meus Downloads</h1>
        <p className="text-[var(--color-zim-muted)] text-sm">Histórico dos arquivos STL que você já baixou.</p>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)] overflow-hidden p-2">
        {logs && logs.length > 0 ? (
          <div className="divide-y divide-[var(--color-zim-border)]">
            {logs.map((log: any) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-[var(--color-zim-border)] overflow-hidden shrink-0 flex items-center justify-center">
                    {log.stl_files?.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={log.stl_files.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Download className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{log.stl_files?.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400">
                        {log.stl_files?.category || 'Geral'}
                      </span>
                      <span className="text-xs flex items-center text-zinc-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(log.downloaded_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/membro/arquivo/${log.stl_files?.id}`}
                  className="inline-flex items-center text-sm font-medium text-[var(--color-zim-orange)] hover:text-white transition-colors p-2 sm:p-0"
                >
                  Ver arquivo <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Nenhum download ainda</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
              Você ainda não fez o download de nenhum arquivo. Navegue pelo acervo e escolha o seu primeiro modelo!
            </p>
            <Link 
              href="/membro"
              className="inline-flex items-center px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors"
            >
              Ir para o Acervo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
