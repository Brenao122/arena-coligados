import 'server-only'
import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET - Buscar estatísticas do dashboard
export async function GET() {
  try {
    // SUPABASE (server)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!  // server role no servidor
    )
    const { data: leads, error: leadsErr } = await supabase
      .from('leads')
      .select('*')
      .limit(1)

    if (leadsErr) {
      console.error('[DASHBOARD] supabase error:', leadsErr)
      return NextResponse.json({ ok: false, source: 'supabase', error: leadsErr.message }, { status: 500 })
    }

    // SHEETS (server)
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const sheetId = process.env.SHEETS_SPREADSHEET_ID!
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'clientes',
    })

    return NextResponse.json({
      ok: true,
      source: 'hybrid',
      counts: {
        supabaseLeads: leads?.length ?? 0,
        sheetClientes: r.data.values?.length ?? 0,
      },
    })
  } catch (e: any) {
    console.error('[DASHBOARD] fatal:', e)
    return NextResponse.json({ ok: false, source: 'fatal', error: String(e?.message ?? e) }, { status: 500 })
  }
}
