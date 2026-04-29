'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hexagon, Box, Users, Activity, History } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role?: string
  email?: string
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

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
    <div className="w-64 bg-[var(--color-zim-card)] border-r border-[var(--color-zim-border)] hidden md:flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-[var(--color-zim-border)]">
        <Link href={role === 'admin' ? '/admin' : '/membro'} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-[var(--color-zim-orange)]/20 shadow-[0_0_15px_rgba(255,95,31,0.15)]">
            <Hexagon className="w-5 h-5 text-[var(--color-zim-orange)]" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-white">ZIM3D</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-[var(--color-zim-orange)]/10 text-[var(--color-zim-orange)] font-semibold" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[var(--color-zim-orange)]" : "text-zinc-500 group-hover:text-zinc-300")} />
              {link.name}
            </Link>
          )
        })}
      </nav>
      
    </div>
  )
}
