import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const codigoCliente = searchParams.get("codigoCliente")

  try {
    // Busca todos os clientes
    const response = await fetch("https://app.nextfit.com.br/api/v1/Pessoa/GetClientes", {
      headers: {
        Authorization: `Bearer ${process.env.NEXTFIT_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    // Filtra pelo codigoCliente
    if (data.items && Array.isArray(data.items)) {
      const clienteEncontrado = data.items.find(
        (cliente: any) => String(cliente.id) === codigoCliente || String(cliente.codigoCliente) === codigoCliente,
      )

      return NextResponse.json({
        metodo: "Buscar todos e filtrar",
        totalClientes: data.items.length,
        clienteEncontrado: clienteEncontrado || null,
        observacao: clienteEncontrado ? "Cliente encontrado!" : "Cliente não encontrado na lista",
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        erro: "Erro ao buscar",
        detalhes: String(error),
      },
      { status: 500 },
    )
  }
}
