import type { Metadata } from "next"
import MidiaKitClientPage from "./_components/MidiaKitClientPage"

export const metadata: Metadata = {
  title: "Mídia Kit - Recursos para Parceiros e Imprensa",
  description:
    "Recursos oficiais da Arena Coligados para parceiros e imprensa. Logos, paleta de cores, dados estatísticos e apresentação institucional. Faça download do mídia kit completo.",
  openGraph: {
    title: "Mídia Kit Arena Coligados - Recursos para Parceiros",
    description: "Logos, cores oficiais, dados e apresentação institucional para parceiros e imprensa.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MidiaKitPage() {
  return <MidiaKitClientPage />
}
