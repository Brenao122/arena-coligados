import { NextResponse } from "next/server"
import { readSheetData } from "@/lib/integrations/google-sheets-complete"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const telefone = searchParams.get("telefone")

    if (!telefone) {
      return NextResponse.json({ error: "Telefone não fornecido" }, { status: 400 })
    }

    const creditos = await readSheetData("Creditos")

    const creditosCliente = creditos.filter((row: any) => row.Telefone === telefone && row.Status === "DISPONIVEL")

    const totalCredito = creditosCliente.reduce((sum: number, row: any) => sum + Number.parseFloat(row.Valor || "0"), 0)

    return NextResponse.json({
      success: true,
      creditos: creditosCliente,
      total: totalCredito,
    })
  } catch (error) {
    console.error("Erro ao consultar créditos:", error)
    return NextResponse.json({ error: "Erro ao consultar créditos" }, { status: 500 })
  }
}
