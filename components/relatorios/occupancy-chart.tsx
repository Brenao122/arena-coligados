"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
// Migrado para Google Sheets

interface OccupancyData {
  day: string
  ocupacao: number
  total: number
}

export function OccupancyChart() {
  const [data, setData] = useState<OccupancyData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState("")

  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        setLoading(true)

        // Buscar dados reais de ocupação do Google Sheets
        const response = await fetch('/api/sheets/read?sheet=Reservas')
        const result = await response.json()
        
        if (!result.ok) throw new Error('Erro ao buscar reservas')
        
        const reservas = result.values?.slice(1) || []
        const reservasData = reservas
          .filter((r: any[]) => {
            const dataInicio = new Date(r[4]) // data_inicio
            return dataInicio >= new Date(getWeekStart()) && dataInicio <= new Date(getWeekEnd())
          })
          .map((r: any[]) => ({
            date: r[4], // data_inicio
            quadra_id: r[2] // quadra
          }))

        // Calcular ocupação por dia da semana
        const weekData = calculateWeeklyOccupancy(reservasData || [])
        setData(weekData)
        setCurrentWeek(getCurrentWeekRange())
      } catch (error) {
        // Fallback para dados vazios em caso de erro
        setData([
          { day: "Seg", ocupacao: 0, total: 0 },
          { day: "Ter", ocupacao: 0, total: 0 },
          { day: "Qua", ocupacao: 0, total: 0 },
          { day: "Qui", ocupacao: 0, total: 0 },
          { day: "Sex", ocupacao: 0, total: 0 },
          { day: "Sáb", ocupacao: 0, total: 0 },
          { day: "Dom", ocupacao: 0, total: 0 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchOccupancyData()
  }, [])

  const getWeekStart = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    return new Date(now.setDate(diff)).toISOString().split("T")[0]
  }

  const getWeekEnd = () => {
    const start = new Date(getWeekStart())
    start.setDate(start.getDate() + 6)
    return start.toISOString().split("T")[0]
  }

  const getCurrentWeekRange = () => {
    const start = new Date(getWeekStart())
    const end = new Date(getWeekEnd())
    return `${start.getDate().toString().padStart(2, "0")}/${(start.getMonth() + 1).toString().padStart(2, "0")} - ${end.getDate().toString().padStart(2, "0")}/${(end.getMonth() + 1).toString().padStart(2, "0")}`
  }

  const calculateWeeklyOccupancy = (reservas: Array<{ date: string; quadra_id: string }>) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const weekData = days.map((day, index) => {
      const dayReservas = reservas.filter((r) => new Date(r.date).getDay() === index)
      const ocupacao = Math.min((dayReservas.length / 12) * 100, 100) // Assumindo 12 slots por dia
      return {
        day: day === "Dom" ? "Dom" : days[index],
        ocupacao: Math.round(ocupacao),
        total: dayReservas.length,
      }
    })
    return weekData.slice(1).concat(weekData.slice(0, 1)) // Reordenar para começar na segunda
  }

  const chartConfig = {
    ocupacao: {
      label: "Ocupação (%)",
      color: "hsl(var(--color-chart-3))",
    },
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Ocupação das Quadras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 animate-pulse bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Ocupação das Quadras</CardTitle>
            <CardDescription className="text-gray-400">Percentual de ocupação por dia da semana</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center text-white">{currentWeek}</span>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" tick={{ fill: "#9CA3AF" }} axisLine={{ stroke: "#374151" }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF" }} axisLine={{ stroke: "#374151" }} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  name === "ocupacao" ? `${value}%` : value,
                  name === "ocupacao" ? "Ocupação" : "Total de Reservas",
                ]}
              />
              <Bar dataKey="ocupacao" fill="#10B981" name="ocupacao" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

