import 'server-only'
import { NextResponse } from "next/server"
import { dataManager } from "@/lib/data-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET - Buscar clientes
export async function GET() {
  try {
    const result = await dataManager.getClientes()
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source,
      count: result.data?.length || 0
    })
  } catch (error: any) {
    console.error("Erro ao buscar clientes:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao buscar clientes"
    }, { status: 500 })
  }
}

// POST - Criar cliente
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validação básica
    if (!body.nome || !body.email) {
      return NextResponse.json({
        ok: false,
        error: "Nome e email são obrigatórios"
      }, { status: 400 })
    }

    const result = await dataManager.createCliente(body)
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source,
      message: "Cliente criado com sucesso"
    })
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao criar cliente"
    }, { status: 500 })
  }
}
