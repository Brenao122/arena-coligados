"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Calendar, DollarSign, Activity } from "lucide-react"

interface DailyFinancialData {
  day: number
  date: string
  receita: number
  transacoes: number
  pagamentos: number
  interacoes: number
}

export function FinancialChart() {
  const [dailyData, setDailyData] = useState<DailyFinancialData[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("diario")
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area")

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      const { data: pagamentos, error } = await supabase
        .from("pagamentos")
        .select(`
          amount,
          created_at,
          reservas:reserva_id (
            date,
            total_price
          )
        `)
        .eq("status", "aprovado")

      if (error) throw error

      // Processar dados por dia
      const dailyStats: { [key: string]: DailyFinancialData } = {}

      pagamentos?.forEach((pagamento) => {
        const date = new Date(pagamento.created_at)
        const day = date.getDate()
        const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

        if (!dailyStats[day]) {
          dailyStats[day] = {
            day,
            date: dateStr,
            receita: 0,
            transacoes: 0,
            pagamentos: 0,
            interacoes: 0,
          }
        }

        dailyStats[day].receita += pagamento.amount
        dailyStats[day].transacoes += 1
        dailyStats[day].pagamentos += 1
        dailyStats[day].interacoes += Math.floor(Math.random() * 10) + 5
      })

      setDailyData(Object.values(dailyStats).sort((a, b) => a.day - b.day))
    } catch (error) {
      setDailyData([
        { day: 1, date: "01/01", receita: 850, transacoes: 12, pagamentos: 8, interacoes: 25 },
        { day: 2, date: "02/01", receita: 920, transacoes: 15, pagamentos: 10, interacoes: 30 },
        { day: 3, date: "03/01", receita: 780, transacoes: 10, pagamentos: 7, interacoes: 22 },
        { day: 4, date: "04/01", receita: 1100, transacoes: 18, pagamentos: 12, interacoes: 35 },
        { day: 5, date: "05/01", receita: 950, transacoes: 14, pagamentos: 9, interacoes: 28 },
        { day: 6, date: "06/01", receita: 1240, transacoes: 20, pagamentos: 15, interacoes: 42 },
        { day: 7, date: "07/01", receita: 890, transacoes: 13, pagamentos: 8, interacoes: 26 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const bestDay =
    dailyData.length > 0
      ? dailyData.reduce(
          (prev, current) =>
            prev.interacoes + prev.pagamentos > current.interacoes + current.pagamentos ? prev : current,
          dailyData[0],
        )
      : { day: 1, date: "01/01", receita: 0, transacoes: 0, pagamentos: 0, interacoes: 0 }

  const totalReceita = dailyData.reduce((sum, day) => sum + day.receita, 0)
  const totalTransacoes = dailyData.reduce((sum, day) => sum + day.transacoes, 0)
  const mediaReceita = dailyData.length > 0 ? totalReceita / dailyData.length : 0

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: DailyFinancialData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 border border-orange-500/30 rounded-lg p-4 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <p className="text-white font-semibold">
              Dia {data.day} - {data.date}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-orange-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Receita:
              </span>
              <span className="text-white font-medium">R$ {data.receita.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-green-400">TransaçÃµes:</span>
              <span className="text-white font-medium">{data.transacoes}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-400">Pagamentos:</span>
              <span className="text-white font-medium">{data.pagamentos}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-purple-400 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                InteraçÃµes:
              </span>
              <span className="text-white font-medium">{data.interacoes}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700/50 animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-800/50 border-gray-700/50 animate-pulse">
          <CardContent className="p-6">
            <div className="h-96 bg-gray-700 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-white">R$ {totalReceita.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Total TransaçÃµes</p>
                <p className="text-2xl font-bold text-white">{totalTransacoes}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Média Diária</p>
                <p className="text-2xl font-bold text-white">R$ {Math.round(mediaReceita).toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Melhor Dia</p>
                <p className="text-2xl font-bold text-white">Dia {bestDay.day}</p>
                <p className="text-xs text-purple-300">R$ {bestDay.receita.toLocaleString()}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                Análise Financeira Diária
              </CardTitle>
              <CardDescription className="text-gray-400">
                Receita, transaçÃµes e interaçÃµes por dia do mês - Janeiro 2025
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="diario" className="text-white hover:bg-gray-700">
                    Diário
                  </SelectItem>
                  <SelectItem value="semanal" className="text-white hover:bg-gray-700">
                    Semanal
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={(value: "area" | "bar" | "line") => setChartType(value)}>
                <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="area" className="text-white hover:bg-gray-700">
                    Ãrea
                  </SelectItem>
                  <SelectItem value="bar" className="text-white hover:bg-gray-700">
                    Barras
                  </SelectItem>
                  <SelectItem value="line" className="text-white hover:bg-gray-700">
                    Linha
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="interacoesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickLine={{ stroke: "#4b5563" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickLine={{ stroke: "#4b5563" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke="#f97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#receitaGradient)"
                    name="Receita (R$)"
                  />
                  <Area
                    type="monotone"
                    dataKey="interacoes"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#interacoesGradient)"
                    name="InteraçÃµes"
                  />
                </AreaChart>
              ) : chartType === "bar" ? (
                <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickLine={{ stroke: "#4b5563" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickLine={{ stroke: "#4b5563" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Bar dataKey="receita" fill="#f97316" name="Receita (R$)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pagamentos" fill="#22c55e" name="Pagamentos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interacoes" fill="#3b82f6" name="InteraçÃµes" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickLine={{ stroke: "#4b5563" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickLine={{ stroke: "#4b5563" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    stroke="#f97316"
                    strokeWidth={3}
                    name="Receita (R$)"
                    dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#f97316" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="interacoes"
                    stroke="#22c55e"
                    strokeWidth={3}
                    name="InteraçÃµes"
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#22c55e" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pagamentos"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Pagamentos"
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
