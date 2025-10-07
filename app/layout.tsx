import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Oswald } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth-simple"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-montserrat",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arena-coligados.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Arena Coligados - Gestão Esportiva",
  description: "Sistema completo de gestão para arenas esportivas",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
