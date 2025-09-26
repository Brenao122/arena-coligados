import { NextResponse } from "next/server"
import { listAllSheets, readSheetData } from "@/lib/integrations/google-sheets-complete"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const integrationStatus = {
      googleSheets: {
        connected: false,
        sheets: [],
        error: null,
        dataCount: 0,
      },
      supabase: {
        connected: false,
        tables: [],
        error: null,
        userCount: 0,
      },
      realUsers: [],
    }

    try {
      const sheets = await listAllSheets()
      integrationStatus.googleSheets.connected = true
      integrationStatus.googleSheets.sheets = sheets

      // Tentar ler dados de uma aba
      if (sheets.length > 0) {
        const firstSheetData = await readSheetData(sheets[0])
        integrationStatus.googleSheets.dataCount = firstSheetData.length
      }
    } catch (error) {
      integrationStatus.googleSheets.error = error.message
    }

    try {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .not("email", "like", "%@email.com")
        .not("email", "like", "teste.%")
        .not("email", "eq", "admin122@arena.com")

      if (error) throw error

      integrationStatus.supabase.connected = true
      integrationStatus.supabase.userCount = users?.length || 0
      integrationStatus.realUsers = users || []

      // Verificar tabelas principais
      const tables = ["profiles", "quadras", "reservas", "leads", "pagamentos", "professores"]
      for (const table of tables) {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (!error) {
          integrationStatus.supabase.tables.push({ name: table, count })
        }
      }
    } catch (error) {
      integrationStatus.supabase.error = error.message
    }

    return NextResponse.json({
      success: true,
      integration: integrationStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
