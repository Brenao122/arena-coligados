"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface OccupancyData {
  day: string
  ocupacao: number
  total: number
}

const mockOccupancyData: OccupancyData[] = [
  { day: "Seg", ocupacao: 75, total: 9 },
  { day: "Ter", ocupacao: 60, total: 7 },
  { day: "Qua", ocupacao: 85, total: 10 },
  { day: "Qui", ocupacao: 70, total: 8 },
  { day: "Sex", ocupacao: 90, total: 11 },
  { day: "Sáb", ocupacao: 95, total: 12 },
  { day: "Dom", ocupacao: 50, total: 6 },
]

export function OccupancyChart() {
  const [data, setData] = useState<OccupancyData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState("")

  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        setLoading(true)

        const response = await fetch("/api/sheets/occupancy-data")
        if (response.ok) {
          const sheetsData = await response.json()
          setData(sheetsData)
          setCurrentWeek(getCurrentWeekRange())
          return
        }

        setData(mockOccupancyData)
        setCurrentWeek(getCurrentWeekRange())
      } catch (error) {
        console.error("Erro ao buscar dados de ocupação:", error)
        setData(mockOccupancyData)
      } finally {
        setLoading(false)
      }
    }

    fetchOccupancyData()
  }, [])

  const getCurrentWeekRange = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const start = new Date(now.setDate(diff))
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    return `${start.getDate().toString().padStart(2, "0")}/${(start.getMonth() + 1).toString().padStart(2, "0")} - ${end.getDate().toString().padStart(2, "0")}/${(end.getMonth() + 1).toString().padStart(2, "0")}`
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
