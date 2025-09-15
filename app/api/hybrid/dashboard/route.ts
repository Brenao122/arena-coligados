import 'server-only'
import { NextResponse } from "next/server"
import { dataManager } from "@/lib/data-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET - Buscar estatísticas do dashboard
export async function GET() {
  try {
    const result = await dataManager.getDashboardStats()
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source
    })
  } catch (error: any) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao buscar estatísticas"
    }, { status: 500 })
  }
}
