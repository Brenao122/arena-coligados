import 'server-only'
import { NextResponse } from "next/server"
import { dataManager } from "@/lib/data-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST - Sincronizar todos os dados
export async function POST() {
  try {
    const result = await dataManager.syncAllData()
    
    return NextResponse.json({
      ok: result.success,
      message: result.message,
      data: result
    })
  } catch (error: any) {
    console.error("Erro na sincronização:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro na sincronização"
    }, { status: 500 })
  }
}

// GET - Status da sincronização
export async function GET() {
  try {
    // Verificar status de ambos os sistemas
    const [supabaseStatus, sheetsStatus] = await Promise.all([
      checkSupabaseStatus(),
      checkSheetsStatus()
    ])
    
    return NextResponse.json({
      ok: true,
      data: {
        supabase: supabaseStatus,
        sheets: sheetsStatus,
        lastSync: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error("Erro ao verificar status:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao verificar status"
    }, { status: 500 })
  }
}

async function checkSupabaseStatus() {
  try {
    const { dataManager } = await import("@/lib/data-manager")
    const result = await dataManager.getClientes()
    return {
      connected: result.source === 'supabase',
      status: result.source === 'supabase' ? 'online' : 'offline'
    }
  } catch (error) {
    return {
      connected: false,
      status: 'error',
      error: error.message
    }
  }
}

async function checkSheetsStatus() {
  try {
    const response = await fetch('/api/sheets/ping')
    const result = await response.json()
    return {
      connected: result.ok,
      status: result.ok ? 'online' : 'offline'
    }
  } catch (error) {
    return {
      connected: false,
      status: 'error',
      error: error.message
    }
  }
}
