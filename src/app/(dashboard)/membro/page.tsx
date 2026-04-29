import { createClient } from '@/lib/supabase/server'
import AcervoGrid from '@/components/AcervoGrid'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default async function MembroDashboard() {
  const supabase = await createClient()

  // Buscar os 4 mais recentes
  const { data: latestFiles } = await supabase
    .from('stl_files')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 to-[var(--color-zim-card)] border border-[var(--color-zim-border)] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-[var(--color-zim-orange)] opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-72 h-72 bg-[var(--color-zim-cyan)] opacity-10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Bem-vindo ao <span className="text-[var(--color-zim-orange)]">ZIM3D</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl mb-8 leading-relaxed">
            Seu acesso exclusivo aos melhores modelos 3D está ativo. Explore o acervo, baixe os arquivos e boa impressão!
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/membro/acervo"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,95,31,0.2)]"
            >
              Explorar Acervo Completo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/membro/licenca"
              className="inline-flex items-center justify-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
            >
              Ler Termos de Uso
            </Link>
          </div>
        </div>
      </div>

      {/* Novidades */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-zim-orange)]/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-[var(--color-zim-orange)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Novidades Recém-Adicionadas</h2>
            <p className="text-sm text-zinc-400">Os últimos modelos que entraram na plataforma</p>
          </div>
        </div>

        {latestFiles && latestFiles.length > 0 ? (
          <AcervoGrid 
            files={latestFiles} 
            hideSearch={true} 
            title="" 
            subtitle="" 
          />
        ) : (
          <div className="text-center py-12 bg-[var(--color-zim-card)] rounded-2xl border border-[var(--color-zim-border)]">
            <p className="text-zinc-500">Nenhum modelo disponível ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
