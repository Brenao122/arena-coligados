"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserWithRole } from "@/lib/supabase/get-user-with-role"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const { user, role } = await getUserWithRole()

      if (!user) {
        router.replace("/login")
        return
      }

      console.log("[v0] User:", user.email)
      console.log("[v0] Role:", role)

      const target =
        role === "admin"
          ? "/dashboard/dashboard-admin"
          : role === "professor"
            ? "/dashboard/dashboard-professor"
            : "/dashboard/dashboard-aluno"

      console.log("[v0] Redirecting to:", target)
      router.replace(target)
    }

    handleRedirect()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecionando...</p>
      </div>
    </div>
  )
}
