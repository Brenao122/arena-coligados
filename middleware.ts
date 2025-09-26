import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // [LOGIN→CRM] Middleware simplificado para não interferir com redirecionamento
  console.log('[LOGIN→CRM] Middleware executado para:', pathname)
  
  // Rotas protegidas que precisam de autenticação
  const protectedRoutes = ["/dashboard", "/crm"]
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = pathname === "/login" || pathname.startsWith("/auth")
  
  // Para rotas protegidas, permitir acesso (o AccessControl no layout gerencia a autenticação)
  if (isProtected) {
    console.log('[LOGIN→CRM] Rota protegida acessada:', pathname)
    return NextResponse.next()
  }
  
  // Para rotas de auth, permitir acesso
  if (isAuthRoute) {
    console.log('[LOGIN→CRM] Rota de auth acessada:', pathname)
    return NextResponse.next()
  }
  
  // Para outras rotas, permitir acesso
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/crm/:path*",
    "/dashboard/:path*", 
    "/login",
    "/auth/:path*"
  ]
}
