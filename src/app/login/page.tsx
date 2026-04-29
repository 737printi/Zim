'use client'

import { useState } from 'react'
import { Hexagon, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
import { login } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-zim-bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-zim-orange)] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[var(--color-zim-cyan)] opacity-10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] shadow-[0_0_20px_rgba(255,95,31,0.2)] mb-6">
            <Hexagon className="w-8 h-8 text-[var(--color-zim-orange)]" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">ZIM3D</h1>
          <p className="text-[var(--color-zim-muted)] text-sm">Acesso exclusivo ao repositório de arquivos</p>
        </div>

        <div className="bg-[var(--color-zim-card)]/80 backdrop-blur-xl border border-[var(--color-zim-border)] rounded-2xl p-8 shadow-2xl">
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-zim-muted)] uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[var(--color-zim-border)] rounded-xl bg-zinc-950/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] focus:border-transparent transition-all sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-zim-muted)] uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[var(--color-zim-border)] rounded-xl bg-zinc-950/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-zim-orange)] focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                E-mail ou senha incorretos.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-zim-orange)] focus:ring-offset-[var(--color-zim-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/recuperar-senha" className="text-sm text-[var(--color-zim-muted)] hover:text-[var(--color-zim-orange)] transition-colors">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-zinc-600">
          <p>Exclusivo para assinantes ativos.</p>
        </div>
      </div>
    </div>
  )
}
