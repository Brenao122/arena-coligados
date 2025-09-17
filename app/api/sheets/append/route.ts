import 'server-only'
import { NextResponse } from 'next/server'
import { sheetsService } from '@/lib/sheets'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sheet = 'Página1', range = 'A:Z', values } = body
    
    if (!values || !Array.isArray(values)) {
      return NextResponse.json({
        ok: false,
        error: 'Valores são obrigatórios e devem ser um array'
      }, { status: 400 })
    }
    
    console.log(`📝 Escrevendo na planilha: ${sheet}, range: ${range}`)
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!
    const result = await sheetsService.appendToSheet(spreadsheetId, `${sheet}!${range}`, values)
    
    if (result.ok) {
      return NextResponse.json({
        ok: true,
        data: result.data,
        updatedRows: result.updatedRows,
        sheet,
        range
      })
    } else {
      return NextResponse.json({
        ok: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Erro na API sheets/append:', error.message)
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 })
  }
}