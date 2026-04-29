import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Hexagon, CheckCircle2, Zap, ShieldCheck, Box, Users, ChevronRight, PlayCircle } from 'lucide-react'

export const revalidate = 3600 // Revalidate cache every hour

export default async function LandingPage() {
  const supabase = await createClient()

  // Buscar 4 modelos recentes para a vitrine
  const { data: showcaseFiles } = await supabase
    .from('stl_files')
    .select('id, title, category, thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(4)

  const checkoutUrl = "https://pay.kiwify.com.br" // URL de Placeholder, o usuário trocará depois

  return (
    <div className="min-h-screen bg-[var(--color-zim-bg)] text-white overflow-x-hidden">
      
      {/* Navbar Minimalista */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="w-8 h-8 text-[var(--color-zim-orange)]" />
            <span className="font-display font-bold text-2xl tracking-wide text-white">ZIM3D</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-zinc-300 hover:text-white font-medium transition-colors">
              Acessar Plataforma
            </Link>
            <a 
              href={checkoutUrl}
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,95,31,0.2)]"
            >
              Assinar Agora
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-zim-orange)] opacity-10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-[var(--color-zim-cyan)] opacity-10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[var(--color-zim-orange)] font-semibold text-sm">
              <Zap className="w-4 h-4 fill-current" />
              <span>A Revolução na Impressão 3D Comercial</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1]">
              Transforme a sua <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-zim-orange)] to-yellow-500">
                Impressora 3D
              </span><br/>
              em um Negócio.
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Tenha acesso ilimitado a um acervo premium de modelos STL testados, com <strong>Licença Comercial inclusa</strong> para vender as peças físicas em qualquer marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a 
                href={checkoutUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(255,95,31,0.3)] hover:scale-105"
              >
                Garantir meu Acesso
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
              <div className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                Risco Zero. Cancele quando quiser.
              </div>
            </div>
          </div>

          {/* Espaço do Vídeo de Vendas (VSL) */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-[var(--color-zim-border)] shadow-2xl group">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer">
              <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-2xl" />
              <p className="mt-4 font-bold tracking-wide text-white drop-shadow-md">CLIQUE PARA ASSISTIR</p>
            </div>
            {/* Placeholder da capa do vídeo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-zinc-800" />
            {/* 
              Para colocar o vídeo real depois (Ex: YouTube/Vimeo):
              <iframe src="LINK_DO_VIDEO" className="w-full h-full" frameBorder="0" allowFullScreen></iframe> 
            */}
          </div>
        </div>
      </section>

      {/* Pricing / Offer Section */}
      <section className="py-20 bg-zinc-950 border-y border-[var(--color-zim-border)] relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-[var(--color-zim-card)] rounded-3xl border border-[var(--color-zim-orange)]/30 p-8 md:p-12 shadow-[0_0_50px_rgba(255,95,31,0.1)] flex flex-col md:flex-row gap-12 items-center">
            
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Tudo que você precisa por uma assinatura única.</h2>
              
              <ul className="space-y-4">
                {[
                  'Novos arquivos STL exclusivos toda semana.',
                  'Licença Comercial Ilimitada (venda as peças impressas).',
                  'Acesso a fotos em alta qualidade para seus anúncios.',
                  'Grupo de Suporte VIP no WhatsApp.',
                  'Modelos 100% testados e otimizados para impressão.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[var(--color-zim-cyan)] shrink-0" />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-80 bg-zinc-900 border border-[var(--color-zim-border)] rounded-2xl p-8 text-center relative overflow-hidden shrink-0">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-zim-cyan)] to-[var(--color-zim-orange)]" />
              <p className="text-zinc-400 font-semibold uppercase tracking-wider mb-2">Assinatura Mensal</p>
              <div className="flex items-start justify-center gap-1 mb-6">
                <span className="text-2xl text-zinc-500 font-bold mt-2">R$</span>
                <span className="text-6xl font-display font-bold text-white">49</span>
                <span className="text-2xl text-zinc-500 font-bold mt-2">,90</span>
              </div>
              <a 
                href={checkoutUrl}
                className="block w-full py-4 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105"
              >
                Assinar Agora
              </a>
              <p className="text-xs text-zinc-500 mt-4">Cobrança recorrente. Cancele quando quiser.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Showcase Section */}
      {showcaseFiles && showcaseFiles.length > 0 && (
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Acervo Premium</h2>
              <p className="text-xl text-zinc-400">Um gostinho do que você vai encontrar na plataforma por dentro.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseFiles.map((file) => (
                <div key={file.id} className="group bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-2xl overflow-hidden hover:border-[var(--color-zim-orange)]/50 transition-all">
                  <div className="aspect-square bg-zinc-900 relative overflow-hidden">
                    {file.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.thumbnail_url} alt={file.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Box className="w-12 h-12 text-zinc-800" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-white mb-1 truncate">{file.title}</h3>
                    <p className="text-xs text-[var(--color-zim-cyan)] uppercase tracking-wider font-semibold">{file.category || 'Geral'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a 
                href={checkoutUrl}
                className="inline-flex items-center gap-2 text-[var(--color-zim-orange)] font-bold hover:text-white transition-colors text-lg"
              >
                Desbloquear Acesso a Todos os Arquivos <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-6">
            {[
              { q: 'Posso vender as peças impressas em 3D?', a: 'Sim! Com a sua assinatura ativa, você recebe uma Licença Comercial que te permite imprimir e vender as peças físicas em qualquer marketplace (Mercado Livre, Shopee, etc).' },
              { q: 'Posso vender o arquivo digital STL?', a: 'Não. A licença permite apenas a comercialização da peça física. A venda, doação ou distribuição dos arquivos digitais é estritamente proibida.' },
              { q: 'Como recebo o acesso aos arquivos?', a: 'O acesso é imediato! Assim que o pagamento da sua assinatura for aprovado, você receberá um e-mail com as instruções de login para a nossa plataforma exclusiva.' },
              { q: 'E se eu cancelar a assinatura?', a: 'Você pode cancelar a qualquer momento sem multas. No entanto, ao cancelar, a sua Licença Comercial é revogada e você perde o direito de continuar vendendo as peças nos marketplaces.' },
            ].map((faq, i) => (
              <div key={i} className="bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA & Links */}
      <footer className="pt-24 pb-12 px-6 border-t border-[var(--color-zim-border)] relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--color-zim-cyan)] opacity-5 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Pronto para começar a lucrar?</h2>
          <a 
            href={checkoutUrl}
            className="inline-flex items-center justify-center px-10 py-5 bg-[var(--color-zim-orange)] hover:bg-[var(--color-zim-orange-hover)] text-white font-bold text-xl rounded-2xl transition-all shadow-[0_0_40px_rgba(255,95,31,0.4)] hover:scale-105"
          >
            Assinar Agora por R$ 49,90/mês
          </a>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500 pt-8 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-zinc-700" />
            <span className="font-bold">&copy; {new Date().getFullYear()} ZIM3D</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Privacidade</Link>
            <Link href="/avisos" className="hover:text-zinc-300 transition-colors">Avisos Legais</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
