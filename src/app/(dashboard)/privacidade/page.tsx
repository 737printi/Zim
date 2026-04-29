import { ShieldCheck } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-[var(--color-zim-border)] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-[var(--color-zim-cyan)]" />
          <h1 className="text-3xl font-display font-bold text-white">Política de Privacidade</h1>
        </div>
        <p className="text-[var(--color-zim-muted)]">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="bg-[var(--color-zim-card)] rounded-3xl border border-[var(--color-zim-border)] p-8 md:p-10 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Coleta de Dados</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Nós coletamos apenas as informações estritamente necessárias para o funcionamento da plataforma e liberação do acesso: nome, e-mail e status de pagamento. Estas informações são sincronizadas automaticamente através do gateway de pagamento (Kiwify).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Uso das Informações</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Seus dados são utilizados exclusivamente para:
          </p>
          <ul className="list-disc pl-5 text-zinc-400 leading-relaxed text-sm space-y-2">
            <li>Geração e liberação do seu acesso ao acervo de arquivos STL.</li>
            <li>Comunicação sobre atualizações da plataforma, novos modelos ou avisos importantes.</li>
            <li>Verificação da validade da sua Licença Comercial de acordo com seu status financeiro.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Armazenamento e Segurança</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Utilizamos provedores de infraestrutura de alto padrão (Supabase e Vercel) que empregam criptografia e medidas de segurança avançadas para proteger seus dados. Nós não temos acesso aos seus dados de cartão de crédito, sendo estes processados diretamente pela Kiwify.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Compartilhamento de Dados</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            A ZIM3D não vende, aluga ou compartilha seus dados pessoais com terceiros para fins de marketing. O compartilhamento ocorre apenas entre nossas ferramentas essenciais (plataforma de e-mail e gateway de pagamento) para a prestação do serviço.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">5. Seus Direitos (LGPD)</h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            De acordo com a Lei Geral de Proteção de Dados, você tem o direito de solicitar a exclusão definitiva dos seus dados da nossa base. No entanto, a exclusão da conta resultará na perda do acesso à plataforma e na revogação da licença comercial associada.
          </p>
        </section>
      </div>
    </div>
  )
}
