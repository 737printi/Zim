import { createClient } from '@/lib/supabase/server'
import { Users, Box, Download, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts
  const { count: alunosAtivos } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')
    .eq('kiwify_status', 'active')

  const { count: totalArquivos } = await supabase
    .from('stl_files')
    .select('*', { count: 'exact', head: true })

  const { count: totalDownloads } = await supabase
    .from('downloads_history')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      name: 'Alunos Ativos',
      value: alunosAtivos || 0,
      icon: Users,
      color: 'text-[var(--color-zim-cyan)]',
      bg: 'bg-[var(--color-zim-cyan)]/10',
      border: 'border-[var(--color-zim-cyan)]/20'
    },
    {
      name: 'Arquivos STL no Acervo',
      value: totalArquivos || 0,
      icon: Box,
      color: 'text-[var(--color-zim-orange)]',
      bg: 'bg-[var(--color-zim-orange)]/10',
      border: 'border-[var(--color-zim-orange)]/20'
    },
    {
      name: 'Downloads Totais',
      value: totalDownloads || 0,
      icon: Download,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20'
    }
  ]

  // Recent Downloads
  const { data: recentDownloads } = await supabase
    .from('downloads_history')
    .select(`
      id,
      downloaded_at,
      profiles ( email ),
      stl_files ( title )
    `)
    .order('downloaded_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Visão Geral</h1>
        <p className="text-[var(--color-zim-muted)]">Acompanhe as métricas e acessos da plataforma ZIM3D.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-2xl p-6 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.border} ${stat.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-zim-muted)] mb-1">{stat.name}</p>
                <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[var(--color-zim-orange)]" />
          <h2 className="text-xl font-bold text-white">Downloads Recentes</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-zim-border)]">
                <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Data / Hora</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Aluno</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Arquivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-zim-border)]">
              {recentDownloads && recentDownloads.length > 0 ? (
                recentDownloads.map((log: any) => (
                  <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-sm text-zinc-400">
                        {new Date(log.downloaded_at).toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-white">{log.profiles?.email}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[var(--color-zim-orange)] font-medium">
                        {log.stl_files?.title}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-zinc-500 text-sm">
                    Nenhum download registrado ainda.
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
