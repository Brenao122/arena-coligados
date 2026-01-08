import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const mensagemTeste = {
      telefone: "62999999999",
      nome: "Cliente Teste",
      data: "2025-01-15",
      horarios: "18:00",
      unidade: "Parque Amazônia",
      quadra: "Quadra 01",
      modalidade: "Beach Tennis",
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/whatsapp/enviar-confirmacao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mensagemTeste),
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: "Teste de WhatsApp executado",
      result,
      nota: "Integre com API real (Baileys, Evolution, ou WhatsApp Business) para envio real",
    })
  } catch (error) {
    console.error("[v0] Erro no teste:", error)
    return NextResponse.json({ error: "Erro no teste" }, { status: 500 })
  }
}
