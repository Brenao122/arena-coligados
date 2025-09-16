import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ENV } from '@/lib/env'

export async function GET() {
  try {
    // Criar client Supabase com variáveis server
    const supabase = createClient(
      ENV.SUPABASE_URL,
      ENV.SUPABASE_SERVICE_ROLE_KEY
    )

    // Buscar dados do dashboard
    const [leadsResult, quadrasResult, reservasResult] = await Promise.all([
      supabase.from('leads').select('*').limit(10),
      supabase.from('quadras').select('*'),
      supabase.from('reservas').select('*').limit(10)
    ])

    return NextResponse.json({
      ok: true,
      data: {
        leads: leadsResult.data || [],
        quadras: quadrasResult.data || [],
        reservas: reservasResult.data || [],
        stats: {
          totalLeads: leadsResult.data?.length || 0,
          totalQuadras: quadrasResult.data?.length || 0,
          totalReservas: reservasResult.data?.length || 0,
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      source: 'supabase',
      error: error.message
    }, { status: 500 })
  }
}
