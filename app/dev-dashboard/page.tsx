"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DevDashboard() {
  const router = useRouter()

  const accessDashboard = (role: string) => {
    localStorage.setItem(
      "dev_user",
      JSON.stringify({
        id: "dev-user-id",
        email: "admin122@arena.com",
        role: role,
        name: role === "admin" ? "Admin Dev" : role === "professor" ? "Professor Dev" : "Aluno Dev",
      }),
    )

    // Redirecionar para o dashboard apropriado
    if (role === "admin") {
      router.push("/dashboard/dashboard-admin")
    } else if (role === "professor") {
      router.push("/dashboard/dashboard-professor")
    } else {
      router.push("/dashboard/dashboard-aluno")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-600">Arena Coligados</CardTitle>
          <CardDescription>Acesso de Desenvolvimento - Escolha seu perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => accessDashboard("admin")} className="w-full bg-orange-600 hover:bg-orange-700">
            Acessar como Admin
          </Button>

          <Button onClick={() => accessDashboard("professor")} className="w-full bg-green-600 hover:bg-green-700">
            Acessar como Professor
          </Button>

          <Button onClick={() => accessDashboard("cliente")} className="w-full bg-blue-600 hover:bg-blue-700">
            Acessar como Aluno
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Apenas para desenvolvimento no v0</p>
            <p>
              Acesse: <code className="bg-gray-100 px-1 rounded">/dev-dashboard</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
