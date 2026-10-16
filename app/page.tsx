import type { Metadata } from "next"
import HomePageClient from "./HomePageClient"

export const metadata: Metadata = {
  title: "Joseph's Well - Affiliate Resources",
  description:
    "Promote Joseph's Well with proven creatives, high EPCs, and commissions of up to $197 per sale.",
  openGraph: {
    title: "Joseph's Well - Affiliate Resources",
    description: "Everything affiliates need to start promoting Joseph's Well.",
  },
}

export default function HomePage() {
  return <HomePageClient />
}
