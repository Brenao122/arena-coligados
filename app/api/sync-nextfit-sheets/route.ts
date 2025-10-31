import { google } from "googleapis"
import { NextResponse } from "next/server"

/**
 * Endpoint de sincronização Nextfit → Google Sheets
 * Última atualização: 2025-10-31
 * Busca clientes e vendas do Nextfit e sincroniza com Google Sheets
 */
export async function POST() {
  try {
    const startTime = Date.now()
    console.log("[v0] Iniciando sincronização Nextfit → Sheets")
    console.log("[v0] Token configurado:", !!process.env.NEXTFIT_API_KEY)

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    const clientesResponse = await fetch("https://integracao.nextfit.com.br/api/v1/Pessoa/GetClientes", {
      headers: {
        "x-api-key": process.env.NEXTFIT_API_KEY!,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Status clientes:", clientesResponse.status)
    console.log("[v0] Content-Type:", clientesResponse.headers.get("content-type"))

    const contentType = clientesResponse.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      const text = await clientesResponse.text()
      console.log("[v0] Resposta não é JSON:", text.substring(0, 200))
      throw new Error(`API retornou HTML ao invés de JSON. Status: ${clientesResponse.status}`)
    }

    if (!clientesResponse.ok) {
      throw new Error(`Erro ao buscar clientes: ${clientesResponse.status}`)
    }

    const clientesData = await clientesResponse.json()
    const clientes = clientesData.items || []

    console.log("[v0] Total de clientes:", clientes.length)

    const vendasResponse = await fetch("https://integracao.nextfit.com.br/api/v1/Venda", {
      headers: {
        "x-api-key": process.env.NEXTFIT_API_KEY!,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Status vendas:", vendasResponse.status)

    const vendasContentType = vendasResponse.headers.get("content-type")
    if (!vendasContentType?.includes("application/json")) {
      const text = await vendasResponse.text()
      console.log("[v0] Resposta vendas não é JSON:", text.substring(0, 200))
      throw new Error(`API de vendas retornou HTML ao invés de JSON. Status: ${vendasResponse.status}`)
    }

    if (!vendasResponse.ok) {
      throw new Error(`Erro ao buscar vendas: ${vendasResponse.status}`)
    }

    const vendasData = await vendasResponse.json()
    const vendas = vendasData.items || []

    console.log("[v0] Total de vendas:", vendas.length)

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

    console.log("[v0] Sincronização concluída com sucesso")
    const executionTime = Date.now() - startTime
    console.log(`[v0] Tempo de execução: ${executionTime}ms`)

    return NextResponse.json({
      sucesso: true,
      totalClientes: clientes.length,
      totalVendas: vendas.length,
      totalLinhas: rows.length - 1,
      tempoExecucao: `${executionTime}ms`,
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
