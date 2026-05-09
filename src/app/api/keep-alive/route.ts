import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Inicializa o cliente do Supabase diretamente (sem cookies, ideal para o Cron da Vercel)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Faz uma requisição super leve apenas para registrar atividade no banco
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) throw error

    return NextResponse.json({ 
      status: 'ok', 
      message: 'Supabase mantido acordado com sucesso!', 
      timestamp: new Date().toISOString() 
    })
  } catch (error: any) {
    console.error('Erro no Cronjob:', error)
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Erro desconhecido' }, 
      { status: 500 }
    )
  }
}
