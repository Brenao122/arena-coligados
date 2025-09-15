import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Middleware para proteção de rotas e autenticação
  console.log('[ARENA-COLIGADOS] Middleware executado para:', pathname)
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Rotas protegidas que precisam de autenticação
  const protectedRoutes = ["/dashboard", "/crm"]
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = pathname === "/login" || pathname.startsWith("/auth")
  
  // Para rotas protegidas, verificar autenticação via localStorage (fallback)
  if (isProtected) {
    console.log('[ARENA-COLIGADOS] Rota protegida acessada:', pathname)
    
    // Verificar se há usuário logado via localStorage (fallback para SSR)
    const userFromStorage = req.headers.get('x-user-data')
    if (!userFromStorage && !isAuthRoute) {
      console.log('[ARENA-COLIGADOS] Usuário não autenticado, redirecionando para login')
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  // Para rotas de auth, permitir acesso
  if (isAuthRoute) {
    console.log('[ARENA-COLIGADOS] Rota de auth acessada:', pathname)
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