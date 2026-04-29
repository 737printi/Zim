import { AlertTriangle } from 'lucide-react'

export default function AvisosLegaisPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[var(--color-zim-border)] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-display font-bold text-white">Avisos Legais</h1>
        </div>
        <p className="text-[var(--color-zim-muted)]">Informações importantes sobre proteção legal e Direitos Autorais.</p>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 md:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <section className="space-y-4 relative z-10">
          <h2 className="text-xl font-bold text-red-400">Direitos Autorais (Copyright)</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Todos os modelos 3D disponibilizados nesta plataforma são criações originais ou devidamente licenciadas para a ZIM3D. Eles são protegidos pelas leis internacionais de direitos autorais e de propriedade intelectual. 
          </p>
        </section>

        <section className="space-y-4 relative z-10">
          <h2 className="text-xl font-bold text-red-400">Pirataria e Medidas Judiciais</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            A ZIM3D possui uma equipe de monitoramento ativo nos principais marketplaces (Mercado Livre, Shopee, Elo7, Etsy, etc). Identificamos anúncios que utilizam nossos designs através de buscas manuais e automatizadas.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-red-500/20">
            <p className="text-zinc-300 text-sm font-medium">
              Caso um anúncio seja encontrado e o vendedor não possua uma assinatura ativa (ou não tenha cadastro em nossa plataforma), as seguintes medidas serão tomadas:
            </p>
            <ul className="list-disc pl-5 text-zinc-400 leading-relaxed text-sm space-y-2 mt-3">
              <li>Denúncia imediata do anúncio na plataforma hospedeira (takedown request) baseada em violação de Copyright.</li>
              <li>Possível banimento permanente da conta do vendedor no marketplace devido às políticas de propriedade intelectual destas plataformas.</li>
              <li>Abertura de processo judicial por perdas e danos e uso indevido de propriedade intelectual.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4 relative z-10">
          <h2 className="text-xl font-bold text-red-400">Uso do Material de Divulgação</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            As imagens (renders e fotos reais) presentes na galeria da plataforma ZIM3D podem ser utilizadas pelos assinantes ativos para divulgação das peças físicas. Porém, as imagens não podem ser alteradas para remover eventuais marcas d'água originais ou adulterar o produto demonstrado.
          </p>
        </section>
      </div>
    </div>
  )
}
