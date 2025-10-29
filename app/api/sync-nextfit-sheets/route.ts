import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    const clientesResponse = await fetch("https://app.nextfit.com.br/api/v1/Pessoa/GetClientes", {
      headers: {
        Authorization: `Bearer ${process.env.NEXTFIT_API_KEY}`,
      },
    })

    if (!clientesResponse.ok) {
      throw new Error(`Erro ao buscar clientes: ${clientesResponse.status}`)
    }

    const clientesData = await clientesResponse.json()
    const clientes = clientesData.items || []

    const vendasResponse = await fetch("https://app.nextfit.com.br/api/v1/Venda", {
      headers: {
        Authorization: `Bearer ${process.env.NEXTFIT_API_KEY}`,
      },
    })

    if (!vendasResponse.ok) {
      throw new Error(`Erro ao buscar vendas: ${vendasResponse.status}`)
    }

    const vendasData = await vendasResponse.json()
    const vendas = vendasData.items || []

    const vendasPorCliente = new Map()
    vendas.forEach((venda: any) => {
      if (!vendasPorCliente.has(venda.codigoCliente)) {
        vendasPorCliente.set(venda.codigoCliente, [])
      }
      vendasPorCliente.get(venda.codigoCliente).push(venda)
    })

    const rows = [
      ["codigoCliente", "nome", "telefone", "email", "dataCadastro", "codigoVenda", "statusVenda", "dataVenda"],
    ]

    clientes.forEach((cliente: any) => {
      const telefone = cliente.dddFone && cliente.fone ? `${cliente.dddFone}${cliente.fone}` : ""

      const vendasCliente = vendasPorCliente.get(cliente.codigo) || []

      if (vendasCliente.length > 0) {
        // Se tem vendas, criar uma linha para cada venda
        vendasCliente.forEach((venda: any) => {
          rows.push([
            cliente.codigo?.toString() || "",
            cliente.nome || "",
            telefone,
            cliente.email || "",
            cliente.dataCadastro || "",
            venda.id?.toString() || "",
            venda.status || "",
            venda.data || "",
          ])
        })
      } else {
        // Se não tem vendas, criar linha só com dados do cliente
        rows.push([
          cliente.codigo?.toString() || "",
          cliente.nome || "",
          telefone,
          cliente.email || "",
          cliente.dataCadastro || "",
          "",
          "",
          "",
        ])
      }
    })

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Sheet1!A:H",
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    })

    return NextResponse.json({
      sucesso: true,
      totalClientes: clientes.length,
      totalVendas: vendas.length,
      totalLinhas: rows.length - 1,
      mensagem: "Dados sincronizados com sucesso!",
    })
  } catch (error: any) {
    console.error("[v0] Erro ao sincronizar:", error)
    return NextResponse.json(
      {
        sucesso: false,
        erro: error.message,
      },
      { status: 500 },
    )
  }
}
