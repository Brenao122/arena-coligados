import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Oswald } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth-simple"
import { ThemeProvider } from "@/contexts/theme-context"
import { PWAInstaller } from "@/components/pwa/pwa-installer"
import { OfflineIndicator } from "@/components/shared/offline-indicator"
import { UpdatePrompt } from "@/components/shared/update-prompt"

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
  title: {
    default: "Arena Coligados - Beach Tennis, Vôlei e Futevôlei em Goiânia",
    template: "%s | Arena Coligados",
  },
  description:
    "Arena Coligados oferece quadras profissionais de Beach Tennis, Vôlei de Praia, Futevôlei e Tênis em Goiânia. 2 unidades, 9 quadras, aulas experimentais grátis. Sua segunda casa no esporte!",
  keywords: [
    "beach tennis",
    "vôlei de praia",
    "futevôlei",
    "tênis",
    "arena esportiva",
    "quadras de areia",
    "esportes Goiânia",
    "aulas de beach tennis",
    "aluguel de quadras",
    "Arena Coligados",
    "Parque Amazônia",
    "Vila Rosa",
    "esportes de areia",
    "aula experimental grátis",
  ],
  authors: [{ name: "Arena Coligados" }],
  creator: "Arena Coligados",
  publisher: "Arena Coligados",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arena Coligados",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Arena Coligados",
    title: "Arena Coligados - Beach Tennis, Vôlei e Futevôlei em Goiânia",
    description:
      "2 unidades com 9 quadras profissionais de areia. Beach Tennis, Vôlei, Futevôlei e Tênis. Aulas experimentais grátis!",
    images: [
      {
        url: `${siteUrl}/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg`,
        width: 1200,
        height: 630,
        alt: "Arena Coligados - Quadras de Beach Sports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arena Coligados - Beach Tennis, Vôlei e Futevôlei em Goiânia",
    description:
      "2 unidades com 9 quadras profissionais de areia. Beach Tennis, Vôlei, Futevôlei e Tênis. Aulas experimentais grátis!",
    images: [`${siteUrl}/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg",
    apple: "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg",
  },
  manifest: "/manifest.json",
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "sports",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${oswald.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Arena Coligados" />
        <link rel="apple-touch-icon" href="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              name: "Arena Coligados",
              description:
                "Arena esportiva com quadras profissionais de Beach Tennis, Vôlei de Praia, Futevôlei e Tênis em Goiânia",
              url: siteUrl,
              logo: `${siteUrl}/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg`,
              image: `${siteUrl}/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg`,
              telephone: "+55-62-XXXXX-XXXX",
              priceRange: "R$ 70-80",
              address: [
                {
                  "@type": "PostalAddress",
                  streetAddress: "Parque Amazônia",
                  addressLocality: "Goiânia",
                  addressRegion: "GO",
                  addressCountry: "BR",
                },
                {
                  "@type": "PostalAddress",
                  streetAddress: "Setor Vila Rosa",
                  addressLocality: "Goiânia",
                  addressRegion: "GO",
                  addressCountry: "BR",
                },
              ],
              geo: {
                "@type": "GeoCoordinates",
                latitude: -16.6869,
                longitude: -49.2648,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "06:00",
                closes: "22:00",
              },
              sameAs: ["https://www.instagram.com/arenacoligados/"],
              sport: ["Beach Tennis", "Volleyball", "Footvolley", "Tennis"],
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Quadras Profissionais",
                  value: "9 quadras de areia",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Unidades",
                  value: "2 unidades em Goiânia",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:shadow-lg focus:ring-4 focus:ring-orange-300"
        >
          Pular para o conteúdo principal
        </a>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <PWAInstaller />
            <OfflineIndicator />
            <UpdatePrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
