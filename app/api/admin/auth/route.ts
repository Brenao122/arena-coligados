import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "arena2025"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      // Criar cookie de sessão
      cookies().set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 8, // 8 horas
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Senha incorreta" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao autenticar" }, { status: 500 })
  }
}

export async function DELETE() {
  // Logout
  cookies().delete("admin_session")
  return NextResponse.json({ success: true })
}
