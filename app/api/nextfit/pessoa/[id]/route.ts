import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const response = await fetch(`https://app.nextfit.com.br/api/v1/Pessoa/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXTFIT_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        erro: "Método não funciona",
        detalhes: String(error),
      },
      { status: 500 },
    )
  }
}
