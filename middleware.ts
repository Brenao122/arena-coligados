import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fksahbiajrccraxvowtv.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2FoYmlhanJjY3JheHZvd3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM1MjQsImV4cCI6MjA3MDY4OTUyNH0.zW0CAWuOkZaRAXVcd0uNRADnf_ADMn9FjtCySFlLKeM",
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options: CookieOptions) => {
          res.cookies.set(name, value, options)
        },
        remove: (name, options: CookieOptions) => {
          res.cookies.set(name, "", { ...options, maxAge: 0 })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl
  const isAuthRoute = pathname === "/login" || pathname.startsWith("/auth")
  const protectedPrefixes = ["/quadras", "/dashboard", "/reservas"]
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))

  if (!user && isProtected) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  if (user && isProtected) {
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()

    const role = roleRow?.role ?? "cliente"

    // Gates de permissÃ£o
    if (pathname.startsWith("/dashboard/dashboard-admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/dashboard-aluno", req.url))
    }
    if (pathname.startsWith("/dashboard/dashboard-professor") && !["professor", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard/dashboard-aluno", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

