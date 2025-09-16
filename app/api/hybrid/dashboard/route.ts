import 'server-only'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Verificar se as ENVs server estão presentes
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      ok: false,
      error: 'Missing server env',
      hasUrl: !!process.env.SUPABASE_URL,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }, { status: 500 })
  }

  try {
    // Criar client Supabase com variáveis server
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      error: error.message,
      source: 'supabase'
    }, { status: 500 })
  }
}
