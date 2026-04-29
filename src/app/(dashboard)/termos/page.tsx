import { FileText } from 'lucide-react'

export default function TermosDeUsoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[var(--color-zim-border)] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-[var(--color-zim-orange)]" />
          <h1 className="text-3xl font-display font-bold text-white">Termos de Uso</h1>
        </div>
        <p className="text-[var(--color-zim-muted)]">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-3xl border border-[var(--color-zim-border)] p-8 md:p-10 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Aceitação dos Termos</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Ao acessar e utilizar a plataforma ZIM3D, você concorda expressamente com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Acesso e Assinatura</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            O acesso ao acervo de modelos 3D é exclusivo para assinantes ativos. O pagamento e gerenciamento da assinatura é intermediado pela Kiwify. Em caso de inadimplência, o acesso à plataforma e as licenças comerciais atreladas serão suspensos imediatamente.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Licença Comercial</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Enquanto sua assinatura estiver ativa, concedemos a você o direito de imprimir os modelos 3D baixados e comercializar exclusivamente as <strong>peças físicas</strong> resultantes. 
          </p>
          <p className="text-zinc-400 leading-relaxed text-sm">
            É <strong>estritamente proibida</strong> a venda, doação, compartilhamento ou redistribuição dos arquivos digitais (.STL) em qualquer formato ou plataforma.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Propriedade Intelectual</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Todos os modelos 3D, designs, textos e imagens presentes na plataforma são de propriedade intelectual exclusiva da ZIM3D. O uso indevido, incluindo a venda de arquivos digitais, sujeitará o infrator a sanções cíveis e criminais conforme a Lei de Direitos Autorais.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">5. Cancelamento</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Você pode cancelar sua assinatura a qualquer momento através do painel da Kiwify. O cancelamento revoga imediatamente a sua licença comercial para vendas futuras. Os produtos físicos que já foram vendidos antes do cancelamento não são afetados.
          </p>
        </section>
      </div>
    </div>
  )
}
