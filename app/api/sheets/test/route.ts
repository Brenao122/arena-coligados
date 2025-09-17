import 'server-only'
import { NextResponse } from 'next/server'
import { sheetsService } from '@/lib/sheets'

export async function GET() {
  try {
    console.log('🧪 Testando conexão com Google Sheets...')
    
    const result = await sheetsService.testConnection()
    
    if (result.ok) {
      return NextResponse.json({
        ok: true,
        message: 'Conexão com Google Sheets funcionando',
        data: result.spreadsheet
      })
    } else {
      return NextResponse.json({
        ok: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Erro ao testar Google Sheets:', error.message)
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 })
  }
}
