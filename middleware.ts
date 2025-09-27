import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fogtbptqvvhoqesljlen.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RicHRxdnZob3Flc2xqbGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzU5NjgsImV4cCI6MjA3MzExMTk2OH0.placeholder"

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  let user = null
  try {
    const token = req.cookies.get("sb-access-token")?.value
    if (token) {
      const { data } = await supabase.auth.getUser(token)
      user = data.user
    }
  } catch (error) {
    console.warn("[middleware] Auth error:", error)
  }

  const { pathname } = req.nextUrl
  if (pathname === "/dev-dashboard") {
    return res
  }

  const isAuthRoute = pathname === "/login" || pathname.startsWith("/auth")
  const protectedPrefixes = ["/quadras", "/dashboard", "/reservas"]
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))

  const devUser = req.cookies.get("dev_user")?.value
  if (devUser && isProtected) {
    return res
  }

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
    try {
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle()

      const role = roleRow?.role ?? "cliente"

      // Gates de permissão
      if (pathname.startsWith("/dashboard/dashboard-admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/dashboard-aluno", req.url))
      }
      if (pathname.startsWith("/dashboard/dashboard-professor") && !["professor", "admin"].includes(role)) {
        return NextResponse.redirect(new URL("/dashboard/dashboard-aluno", req.url))
      }
    } catch (error) {
      console.warn("[middleware] Role check error:", error)
    }
  }

  return res
}

export const config = {
  matcher: ["/dev-dashboard", "/((?!_next/static|_next/image|favicon.ico|images|api/supa-ok|api/supa-admin-ok).*)"],
}
