// app/auth/callback/route.ts
import { NextResponse } from "next/server"
import { getServerClient } from "@/lib/supabase/server-client"
import { getUserWithRole } from "@/lib/supabase/get-user-with-role"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (code) {
    const supa = getServerClient()
    // Cria a sessão a partir do código de OAuth/Magic Link
    await supa.auth.exchangeCodeForSession(code)
  }

  const { user, role } = await getUserWithRole()

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const target =
    role === "admin"
      ? "/dashboard/dashboard-admin"
      : role === "professor"
        ? "/dashboard/dashboard-professor"
        : "/dashboard/dashboard-aluno"

  return NextResponse.redirect(new URL(target, req.url))
}
