import 'server-only'
import { NextResponse } from 'next/server'
import { sheetsService } from '@/lib/sheets'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sheet = searchParams.get('sheet') || 'Página1'
    const range = searchParams.get('range') || 'A:Z'
    
    console.log(`📖 Lendo planilha: ${sheet}, range: ${range}`)
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!
    const result = await sheetsService.readSheet(spreadsheetId, `${sheet}!${range}`)
    
    if (result.ok) {
      return NextResponse.json({
        ok: true,
        data: result.data,
        count: result.count,
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
    console.error('❌ Erro na API sheets/read:', error.message)
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 })
  }
}