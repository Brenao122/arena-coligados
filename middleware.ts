import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Rotas que exigem auth (ajuste se precisar)
const PROTECTED_PREFIXES = ['/dashboard', '/crm']

export async function middleware(req: NextRequest) {
  // resposta base onde o supabase vai setar/limpar cookies
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          // delete() nem sempre chega ao cliente; zera com maxAge=0
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  // isso já força refresh do token quando necessário e sincroniza cookies no `res`
  const { data: { user } } = await supabase.auth.getUser()

  const url = req.nextUrl
  const pathname = url.pathname
  const isLogin = pathname.startsWith('/login')
  const needsAuth = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))

  // se já está logado e pediu /login, manda pro destino (redirectTo) ou /dashboard
  if (user && isLogin) {
    const target = url.searchParams.get('redirectTo') || '/dashboard'
    const redirectUrl = url.clone()
    redirectUrl.pathname = target
    redirectUrl.search = '' // limpa query do login
    const redirectRes = NextResponse.redirect(redirectUrl)
    // garante que eventuais cookies setados acima via `res` cheguem também no redirect
    res.cookies.getAll().forEach(c => redirectRes.cookies.set(c))
    return redirectRes
  }

  // se rota protegida e sem user, manda pro /login preservando redirectTo
  if (needsAuth && !user) {
    const loginUrl = url.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname + url.search)
    const redirectRes = NextResponse.redirect(loginUrl)
    res.cookies.getAll().forEach(c => redirectRes.cookies.set(c))
    return redirectRes
  }

  return res
}

// evita interceptar assets estáticos
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public).*)'],
}
