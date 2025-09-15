import 'server-only'
import { NextResponse } from "next/server"
import { dataManager } from "@/lib/data-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET - Buscar quadras
export async function GET() {
  try {
    const result = await dataManager.getQuadras()
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source,
      count: result.data?.length || 0
    })
  } catch (error: any) {
    console.error("Erro ao buscar quadras:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao buscar quadras"
    }, { status: 500 })
  }
}

// POST - Criar quadra
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validação básica
    if (!body.nome || !body.tipo || !body.preco_hora) {
      return NextResponse.json({
        ok: false,
        error: "Nome, tipo e preço são obrigatórios"
      }, { status: 400 })
    }

    const result = await dataManager.createQuadra(body)
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source,
      message: "Quadra criada com sucesso"
    })
  } catch (error: any) {
    console.error("Erro ao criar quadra:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao criar quadra"
    }, { status: 500 })
  }
}
