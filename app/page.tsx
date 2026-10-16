import type { Metadata } from "next"
import HomePageClient from "./HomePageClient"

export const metadata: Metadata = {
  title: "Joseph's Well - Water Revolution",
  description:
    "Conheça o Joseph's Well e descubra uma alternativa para produzir água e proteger sua família.",
  openGraph: {
    title: "Joseph's Well - Water Revolution",
    description: "Conheça o sistema e veja como ele pode ajudar sua família.",
  }
}

export default function HomePage() {
  return <HomePageClient />
}
