import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Proteger rotas /admin/*
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session")

    // Permitir acesso à página de login
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Verificar se está autenticado
    if (!adminSession || adminSession.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
