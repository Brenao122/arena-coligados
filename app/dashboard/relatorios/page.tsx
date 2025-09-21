"use client"

import { FinancialChart } from "@/components/relatorios/financial-chart"
import { OccupancyChart } from "@/components/relatorios/occupancy-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Calendar, DollarSign } from "lucide-react"

export default function RelatoriosPage() {
  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
          Relatórios
        </h1>
        <p className="text-gray-400">Análise detalhada do desempenho da arena</p>
      </div>

      <Tabs defaultValue="financeiro" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger
            value="financeiro"
            className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-300"
          >
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger
            value="ocupacao"
            className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-300"
          >
            <Calendar className="h-4 w-4" />
            Ocupação
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white text-gray-300"
          >
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro" className="space-y-4">
          <FinancialChart />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Resumo Mensal</CardTitle>
                <CardDescription className="text-gray-400">Principais métricas do mês atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Receita Total</span>
                    <span className="font-medium text-white">R$ 12.450,00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Número de Reservas</span>
                    <span className="font-medium text-white">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Ticket Médio</span>
                    <span className="font-medium text-white">R$ 79,81</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Crescimento</span>
                    <span className="font-medium text-green-400">+12,5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Métodos de Pagamento</CardTitle>
                <CardDescription className="text-gray-400">Distribuição por forma de pagamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">PIX</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full">
                        <div className="w-3/5 h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-white">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Cartão</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full">
                        <div className="w-1/3 h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-white">33%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Dinheiro</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full">
                        <div className="w-1/12 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-white">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ocupacao" className="space-y-4">
          <OccupancyChart />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Horário de Pico</CardTitle>
                <CardDescription className="text-gray-400">Período com maior ocupação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-400">19h - 21h</p>
                  <p className="text-sm text-gray-400">85% de ocupação média</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quadra Mais Popular</CardTitle>
                <CardDescription className="text-gray-400">Maior número de reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">Quadra 1 - Futsal</p>
                  <p className="text-sm text-gray-400">45 reservas este mês</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Taxa de Ocupação</CardTitle>
                <CardDescription className="text-gray-400">Média semanal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">68%</p>
                  <p className="text-sm text-gray-400">+5% vs semana anterior</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Top Professores</CardTitle>
                <CardDescription className="text-gray-400">Ranking por número de aulas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "João Silva", aulas: 28, receita: 2240 },
                    { name: "Maria Santos", aulas: 24, receita: 1920 },
                    { name: "Pedro Costa", aulas: 19, receita: 1520 },
                  ].map((professor, index) => (
                    <div key={professor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white">{professor.name}</p>
                          <p className="text-sm text-gray-400">{professor.aulas} aulas</p>
                        </div>
                      </div>
                      <p className="font-medium text-white">R$ {professor.receita}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Clientes Mais Ativos</CardTitle>
                <CardDescription className="text-gray-400">Ranking por frequência</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Carlos Oliveira", reservas: 12, gasto: 960 },
                    { name: "Ana Paula", reservas: 10, gasto: 800 },
                    { name: "Roberto Lima", reservas: 8, gasto: 640 },
                  ].map((cliente, index) => (
                    <div key={cliente.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-white">{cliente.name}</p>
                          <p className="text-sm text-gray-400">{cliente.reservas} reservas</p>
                        </div>
                      </div>
                      <p className="font-medium text-white">R$ {cliente.gasto}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
