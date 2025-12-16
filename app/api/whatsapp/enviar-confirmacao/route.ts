import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telefone, nome, data, horarios, unidade, quadra, modalidade } = body

    console.log("[v0] Enviando WhatsApp para:", telefone)

    // TODO: Integrar com API WhatsApp (Baileys, Evolution API, ou WhatsApp Business API)
    // Por enquanto, apenas log
    const mensagem = `
🎾 *Reserva Confirmada - Arena Coligados*

Olá *${nome}*! Sua reserva foi confirmada com sucesso! ✅

📅 *Data:* ${new Date(data).toLocaleDateString("pt-BR")}
⏰ *Horário:* ${horarios}
📍 *Local:* ${unidade} - ${quadra}
🏐 *Modalidade:* ${modalidade}

⚠️ *REGRAS IMPORTANTES:*
• Chegue 10 minutos antes do horário
• Cancelamentos devem ser feitos com 24h de antecedência
• Em caso de chuva, entre em contato para reagendamento

📞 *Dúvidas?* Entre em contato:
${unidade === "Parque Amazônia" ? "(62) 3225-5400" : "(62) 3224-1000"}

Nos vemos em breve! 💪
    `.trim()

    console.log("[v0] Mensagem preparada:", mensagem)

    // Aqui você integraria com a API real
    // Exemplo: await enviarWhatsApp(telefone, mensagem)

    return NextResponse.json({ success: true, message: "WhatsApp enviado" })
  } catch (error) {
    console.error("[v0] Erro ao enviar WhatsApp:", error)
    return NextResponse.json({ error: "Erro ao enviar WhatsApp" }, { status: 500 })
  }
}
