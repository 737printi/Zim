import { createClient } from '@/lib/supabase/server'
import { Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import AlunoActions from '@/components/AlunoActions'

export default async function AlunosPage() {
  const supabase = await createClient()

  // Fetch all students (non-admins)
  const { data: alunos } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  function getStatusBadge(status: string) {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium"><CheckCircle className="w-3 h-3" /> Ativo</span>
      case 'canceled':
      case 'inactive':
      case 'refunded':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-medium"><XCircle className="w-3 h-3" /> Cancelado / Inativo</span>
      case 'overdue':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-medium"><AlertTriangle className="w-3 h-3" /> Atrasado</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-500/10 text-zinc-400 text-xs font-medium">{status}</span>
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-[var(--color-zim-border)] pb-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">Alunos da Plataforma</h1>
        <p className="text-[var(--color-zim-muted)] text-sm">Controle e listagem de assinantes sincronizados com a Kiwify.</p>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)]">
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-[var(--color-zim-border)]">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">E-mail do Aluno</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status Kiwify</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Data de Cadastro</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-zim-border)]">
              {alunos && alunos.length > 0 ? (
                alunos.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Users className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-sm font-medium text-white">{aluno.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(aluno.kiwify_status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-400">
                        {new Date(aluno.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <AlunoActions userId={aluno.id} status={aluno.kiwify_status} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                    Nenhum aluno cadastrado ainda. As contas serão criadas automaticamente via webhook.
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
