import 'server-only'
import { NextResponse } from 'next/server'
import { SheetsPrimaryManager } from '@/lib/sheets-primary-manager'

export async function GET() {
  try {
    const manager = new SheetsPrimaryManager()
    const result = await manager.getClientes()

    if (result.ok) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ [API] Erro na rota clientes:', error.message)
    return NextResponse.json({
      ok: false,
      error: error.message,
      source: 'api-error'
    }, { status: 500 })
  }
}
