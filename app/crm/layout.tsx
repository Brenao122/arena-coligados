"use client"

import { AccessControl } from "@/components/layout/access-control"

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccessControl requireAuth={true}>
      {children}
    </AccessControl>
  )
}
