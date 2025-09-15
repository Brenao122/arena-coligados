import 'server-only'
import { NextResponse } from "next/server"
import { dataManager } from "@/lib/data-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// GET - Buscar reservas
export async function GET() {
  try {
    const result = await dataManager.getReservas()
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source,
      count: result.data?.length || 0
    })
  } catch (error: any) {
    console.error("Erro ao buscar reservas:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao buscar reservas"
    }, { status: 500 })
  }
}

// POST - Criar reserva
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validação básica
    if (!body.cliente_id || !body.quadra_id || !body.data_inicio || !body.data_fim) {
      return NextResponse.json({
        ok: false,
        error: "Cliente, quadra, data início e fim são obrigatórios"
      }, { status: 400 })
    }

    // Validar se data fim é maior que data início
    const dataInicio = new Date(body.data_inicio)
    const dataFim = new Date(body.data_fim)
    
    if (dataFim <= dataInicio) {
      return NextResponse.json({
        ok: false,
        error: "Data fim deve ser maior que data início"
      }, { status: 400 })
    }

    const result = await dataManager.createReserva(body)
    
    return NextResponse.json({
      ok: true,
      data: result.data,
      source: result.source,
      message: "Reserva criada com sucesso"
    })
  } catch (error: any) {
    console.error("Erro ao criar reserva:", error)
    return NextResponse.json({
      ok: false,
      error: error.message || "Erro ao criar reserva"
    }, { status: 500 })
  }
}
