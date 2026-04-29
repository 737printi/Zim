import { ShieldAlert, Scale, HelpCircle } from 'lucide-react'

export default function LicencaFAQPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Licença Comercial e FAQ</h1>
        <p className="text-[var(--color-zim-muted)]">Leia atentamente as regras de uso dos modelos 3D fornecidos na plataforma.</p>
      </div>

      <div className="space-y-6">
        {/* Bloco Principal de Licença */}
        <div className="bg-zinc-900/50 border border-[var(--color-zim-orange)]/50 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-zim-orange)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-zim-orange)]/10 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-[var(--color-zim-orange)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Regras da Licença Comercial ZIM3D</h2>
              <div className="space-y-4 text-zinc-300 leading-relaxed text-sm">
                <p>
                  Ao se tornar um assinante da plataforma ZIM3D, você adquire uma <strong>Licença Comercial Condicional</strong>. Isso significa que você tem a permissão expressa para imprimir os nossos modelos em 3D e <strong>vender as peças físicas</strong> livremente em qualquer marketplace (Mercado Livre, Shopee, loja própria, etc).
                </p>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mt-4">
                  <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-5 h-5" />
                    Condição de Cancelamento (Atenção)
                  </h3>
                  <p className="text-red-300/80">
                    A sua licença comercial é válida <strong>apenas enquanto a sua assinatura na Kiwify estiver ATIVA</strong>. 
                  </p>
                  <p className="text-red-300/80 mt-2">
                    A partir do momento que sua assinatura for cancelada ou suspensa por falta de pagamento, a sua licença comercial é <strong>revogada imediatamente</strong>. Você perderá o direito de comercializar as peças. Caso encontremos anúncios ativos de produtos do ZIM3D vinculados a ex-assinantes, medidas legais de proteção de Direitos Autorais (Copyright) serão acionadas e os anúncios serão denunciados e derrubados nos marketplaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-[var(--color-zim-card)] border border-[var(--color-zim-border)] rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-zim-border)] pb-4">
            <HelpCircle className="w-6 h-6 text-[var(--color-zim-cyan)]" />
            <h2 className="text-xl font-bold text-white">Perguntas Frequentes (FAQ)</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-white font-bold">Posso vender o arquivo digital (.STL)?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                <strong>Não.</strong> Sob nenhuma hipótese é permitida a venda, revenda, doação ou distribuição dos arquivos digitais em formato STL. A licença permite apenas a venda da peça já impressa em 3D.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold">Posso usar as fotos de vocês nos meus anúncios?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Sim, enquanto sua assinatura estiver ativa, você tem o direito de usar as fotos de divulgação que disponibilizamos na galeria para criar e ilustrar os seus anúncios de vendas físicas.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold">Cancelei minha assinatura, posso terminar de entregar os pedidos pendentes?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pedidos realizados ANTES do cancelamento da assinatura podem ser impressos e entregues normalmente. No entanto, novos pedidos não poderão ser aceitos e seus anúncios devem ser pausados imediatamente após o cancelamento.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-bold">Minha assinatura atrasou o pagamento, perco a licença?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Caso o pagamento conste como "Atrasado" na Kiwify, o seu acesso ao portal é bloqueado automaticamente. Recomendamos que regularize o pagamento em até 5 dias para evitar o status de Cancelamento definitivo, que acarretaria na revogação da licença comercial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
