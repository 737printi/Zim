'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut, User, Menu, X, Hexagon, Box, Users, Activity, History, Settings, AlertOctagon } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  email?: string
  role?: string
}

export default function Header({ email, role }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: Activity },
    { name: 'Arquivos STL', href: '/admin/arquivos', icon: Box },
    { name: 'Alunos', href: '/admin/alunos', icon: Users },
    { name: 'Log de Downloads', href: '/admin/downloads', icon: History },
  ]

  const studentLinks = [
    { name: 'Início', href: '/membro', icon: Activity },
    { name: 'Acervo 3D', href: '/membro/acervo', icon: Box },
    { name: 'Meus Downloads', href: '/membro/downloads', icon: History },
    { name: 'Licença e FAQ', href: '/membro/licenca', icon: Users },
  ]

  const links = role === 'admin' ? adminLinks : studentLinks

  return (
    <>
      <header className="h-20 bg-[var(--color-zim-card)]/50 backdrop-blur-md border-b border-[var(--color-zim-border)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="md:hidden flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-[var(--color-zim-orange)]" />
            <span className="font-display font-bold text-lg text-white">ZIM3D</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{email}</span>
              <span className="text-xs text-[var(--color-zim-orange)] font-semibold uppercase tracking-wider">
                {role === 'admin' ? 'Administrador' : 'Aluno'}
              </span>
            </div>
            
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:ring-2 hover:ring-[var(--color-zim-orange)] transition-all cursor-pointer"
            >
              <User className="w-4 h-4 md:w-5 md:h-5 text-zinc-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute top-12 right-0 w-56 bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-[var(--color-zim-border)] sm:hidden">
                  <p className="text-sm font-medium text-white truncate">{email}</p>
                </div>
                
                {role === 'student' && (
                  <button 
                    onClick={() => {
                      setIsProfileDropdownOpen(false)
                      setIsCancelModalOpen(true)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4" />
                    Gerenciar Assinatura
                  </button>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cancel Subscription Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCancelModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[var(--color-zim-card)] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 md:p-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-4">Atenção!</h2>
              <div className="space-y-4 text-zinc-300 text-sm leading-relaxed mb-8">
                <p>
                  Tem certeza que deseja cancelar sua assinatura do ZIM3D?
                </p>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-200">
                  <p className="font-semibold text-red-400 mb-2">Consequências imediatas do cancelamento:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Sua <strong>Licença Comercial</strong> será revogada instantaneamente.</li>
                    <li>Você não poderá mais vender as peças já impressas ou imprimir novas para venda.</li>
                    <li>Anúncios em marketplaces serão passíveis de denúncia por violação de Direitos Autorais (Copyright), resultando na derrubada dos mesmos.</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-3">
                <a 
                  href="https://kiwify.com.br" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 font-bold rounded-xl transition-all"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  Entendi, ir para Kiwify cancelar
                </a>
                <button 
                  onClick={() => setIsCancelModalOpen(false)}
                  className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
                >
                  Voltar para o Acervo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-sm h-full bg-[var(--color-zim-card)] border-r border-[var(--color-zim-border)] flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="h-20 flex items-center justify-between px-6 border-b border-[var(--color-zim-border)]">
              <Link href={role === 'admin' ? '/admin' : '/membro'} className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <Hexagon className="w-6 h-6 text-[var(--color-zim-orange)]" />
                <span className="font-display font-bold text-xl tracking-wide text-white">ZIM3D</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              <div className="text-xs font-semibold text-[var(--color-zim-muted)] uppercase tracking-wider mb-4 px-2">
                {role === 'admin' ? 'Administração' : 'Área do Membro'}
              </div>
              
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                      isActive 
                        ? "bg-[var(--color-zim-orange)]/10 text-[var(--color-zim-orange)] font-semibold" 
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[var(--color-zim-orange)]" : "text-zinc-500")} />
                    {link.name}
                  </Link>
                )
              })}
            </nav>
            
            <div className="p-6 border-t border-[var(--color-zim-border)]">
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-xs text-zinc-500">Logado como:</span>
                <span className="text-sm font-medium text-white truncate">{email}</span>
              </div>
              {role === 'student' && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsCancelModalOpen(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors font-medium text-sm mb-2"
                >
                  <Settings className="w-4 h-4" />
                  Gerenciar Assinatura
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 hover:bg-red-500/10 hover:text-red-400 text-white rounded-xl transition-colors font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
