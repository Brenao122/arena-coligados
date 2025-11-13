import type { Metadata } from "next"
import SobreNosPageClient from "./page.client"

export const metadata: Metadata = {
  title: "Sobre Nós - Nossa História e Valores",
  description:
    "Conheça a história da Arena Coligados, fundada por Gustavo Oliveira e Rafael Henrique. Missão, visão, valores e nossas 2 unidades em Goiânia com 9 quadras profissionais de beach sports.",
  openGraph: {
    title: "Sobre Arena Coligados - Nossa História",
    description: "Mais que uma arena esportiva, somos uma família unida pelo esporte e amizade.",
  },
}

export default function SobreNosPage() {
  return <SobreNosPageClient />
}
