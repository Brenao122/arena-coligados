import type { Metadata } from "next"
import HomePageClient from "./HomePageClient"

export const metadata: Metadata = {
  title: "Arena Coligados - Beach Tennis, Vôlei e Futevôlei em Goiânia",
  description:
    "Sua segunda casa no esporte! 2 unidades em Goiânia com 9 quadras profissionais de Beach Tennis, Vôlei de Praia e Futevôlei. Aula experimental grátis. Reserve sua quadra agora!",
  openGraph: {
    title: "Arena Coligados - Sua Segunda Casa no Esporte",
    description: "2 unidades com 9 quadras profissionais. Beach Tennis, Vôlei e Futevôlei. Aula grátis!",
  },
}

export default function HomePage() {
  return <HomePageClient />
}
