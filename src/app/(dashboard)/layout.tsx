import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[var(--color-zim-bg)] flex">
      {/* Sidebar for desktop */}
      <Sidebar role={profile?.role} email={user.email} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header email={user.email} role={profile?.role} />
        
        <main className="flex-1 p-6 overflow-y-auto flex flex-col">
          <div className="flex-1">
            {profile?.kiwify_status !== 'active' && profile?.role !== 'admin' ? (
              <div className="h-full flex items-center justify-center min-h-[60vh]">
                <div className="text-center bg-[var(--color-zim-card)] border border-red-500/20 p-8 rounded-2xl max-w-md">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-500 text-2xl">⚠️</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Assinatura Inativa</h2>
                  <p className="text-[var(--color-zim-muted)] text-sm mb-6">
                    Sua assinatura está inativa no momento. Para continuar baixando os arquivos STL e utilizando a licença comercial, por favor, regularize seu pagamento na Kiwify.
                  </p>
                  <a 
                    href="https://kiwify.com.br" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-colors"
                  >
                    Acessar Kiwify
                  </a>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
          
          {/* Discreet Footer */}
          <footer className="mt-12 pt-6 border-t border-[var(--color-zim-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>&copy; {new Date().getFullYear()} ZIM3D. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Política de Privacidade</Link>
              <Link href="/avisos" className="hover:text-zinc-300 transition-colors">Avisos Legais</Link>
            </div>
          </footer>
        </main>
      </div>

      <WhatsAppButton />
    </div>
  )
}
