import { NextResponse } from "next/server"
import { GoogleSheetsService } from "@/lib/integrations/google-sheets-complete"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { payment_id, telefone, credito, percentual } = body

    if (!payment_id || !telefone) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const sheets = new GoogleSheetsService()

    // Atualizar status da reserva para CANCELADA
    const reservas = await sheets.read("Reservas")
    const rowIndex = reservas.findIndex((row: any) => row.PaymentID === payment_id && row.Telefone === telefone)

    if (rowIndex === -1) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 })
    }

    const reserva = reservas[rowIndex]

    // Atualizar status
    await sheets.update("Reservas", rowIndex + 2, {
      Status: "CANCELADA",
      ObservacaosCancelamento: `Cancelado pelo cliente. Crédito de ${percentual}% (R$ ${credito.toFixed(2)}) gerado.`,
    })

    // Adicionar crédito na aba de Créditos
    await sheets.append("Creditos", {
      Telefone: telefone,
      Nome: reserva.Nome,
      Valor: credito,
      Percentual: percentual,
      OrigemReserva: payment_id,
      DataCancelamento: new Date().toLocaleString("pt-BR"),
      Status: "DISPONIVEL",
      Timestamp: new Date().toISOString(),
    })

    // Enviar WhatsApp de cancelamento
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/whatsapp/enviar-confirmacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone: telefone,
          nome: reserva.Nome,
          tipo: "cancelamento",
          data: reserva.Data,
          horarios: reserva.Horarios ? reserva.Horarios.split(",") : [reserva.Horario],
          unidade: reserva.Unidade,
          credito: credito,
          percentual: percentual,
        }),
      })
    } catch (error) {
      console.error("Erro ao enviar WhatsApp:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error)
    return NextResponse.json({ error: "Erro ao cancelar reserva" }, { status: 500 })
  }
}
