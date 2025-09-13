"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Zap,
  Bell,
  Users,
  Building,
  Smartphone,
  Instagram,
  CreditCard,
  MessageSquare,
  Check,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracoesPage() {
  const { toast } = useToast()
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const [instagramConnected, setInstagramConnected] = useState(true)
  const [mercadoPagoConnected, setMercadoPagoConnected] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const [arenaInfo, setArenaInfo] = useState({
    name: "Arena Coligados",
    phone: "(11) 99999-9999",
    email: "contato@arenacoligados.com",
    cnpj: "12.345.678/0001-90",
    address: "Rua dos Esportes, 123 - Centro, São Paulo - SP",
  })

  const [horarios, setHorarios] = useState([
    { dia: "Segunda-feira", inicio: "06:00", fim: "23:00" },
    { dia: "Terça-feira", inicio: "06:00", fim: "23:00" },
    { dia: "Quarta-feira", inicio: "06:00", fim: "23:00" },
    { dia: "Quinta-feira", inicio: "06:00", fim: "23:00" },
    { dia: "Sexta-feira", inicio: "06:00", fim: "23:00" },
    { dia: "Sábado", inicio: "07:00", fim: "22:00" },
    { dia: "Domingo", inicio: "08:00", fim: "20:00" },
  ])

  const handleIntegrationToggle = (integration: string) => {
    switch (integration) {
      case "whatsapp":
        setWhatsappConnected(!whatsappConnected)
        toast({
          title: whatsappConnected ? "WhatsApp Desconectado" : "WhatsApp Conectado",
          description: whatsappConnected ? "Integração removida com sucesso" : "Integração configurada com sucesso",
        })
        break
      case "instagram":
        setInstagramConnected(!instagramConnected)
        toast({
          title: instagramConnected ? "Instagram Desconectado" : "Instagram Conectado",
          description: instagramConnected ? "Integração removida com sucesso" : "Integração configurada com sucesso",
        })
        break
      case "mercadopago":
        setMercadoPagoConnected(!mercadoPagoConnected)
        toast({
          title: mercadoPagoConnected ? "Mercado Pago Desconectado" : "Mercado Pago Conectado",
          description: mercadoPagoConnected ? "Integração removida com sucesso" : "Integração configurada com sucesso",
        })
        break
    }
  }

  const handleSaveArenaInfo = () => {
    localStorage.setItem("arena-info", JSON.stringify(arenaInfo))
    toast({
      title: "InformaçÃµes Salvas",
      description: "As informaçÃµes da arena foram atualizadas com sucesso",
    })
  }

  const handleSaveHorarios = () => {
    localStorage.setItem("arena-horarios", JSON.stringify(horarios))
    toast({
      title: "Horários Salvos",
      description: "Os horários de funcionamento foram atualizados com sucesso",
    })
  }

  const handleNotificationChange = (type: string, value: boolean) => {
    if (type === "email") {
      setEmailNotifications(value)
    } else if (type === "sms") {
      setSmsNotifications(value)
    }

    toast({
      title: "Preferências Atualizadas",
      description: `NotificaçÃµes por ${type === "email" ? "email" : "SMS"} ${value ? "ativadas" : "desativadas"}`,
    })
  }

  const handleAddUser = () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "O gerenciamento de usuários será implementado em breve",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
          ConfiguraçÃµes
        </h1>
        <p className="text-muted-foreground">Configure integraçÃµes e preferências do sistema</p>
      </div>

      <Tabs defaultValue="integracoes" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="integracoes" className="flex items-center gap-2 data-[state=active]:bg-orange-500">
            <Zap className="h-4 w-4" />
            IntegraçÃµes
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2 data-[state=active]:bg-orange-500">
            <Settings className="h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2 data-[state=active]:bg-orange-500">
            <Bell className="h-4 w-4" />
            NotificaçÃµes
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2 data-[state=active]:bg-orange-500">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integracoes" className="space-y-4">
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Smartphone className="h-5 w-5" />
                  WhatsApp Business API
                </CardTitle>
                <CardDescription>Automatize mensagens e capture leads via WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={whatsappConnected ? "default" : "secondary"}
                      className={whatsappConnected ? "bg-green-500" : ""}
                    >
                      {whatsappConnected ? "Conectado" : "Desconectado"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {whatsappConnected ? "Número: +55 11 99999-9999" : "Não configurado"}
                    </span>
                  </div>
                  <Button
                    variant={whatsappConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationToggle("whatsapp")}
                    className={
                      whatsappConnected
                        ? "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        : "bg-orange-500 hover:bg-orange-600"
                    }
                  >
                    {whatsappConnected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
                {whatsappConnected && (
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> Webhook configurado
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> Mensagens automáticas ativas
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> Captura de leads funcionando
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Instagram className="h-5 w-5" />
                  Instagram Business
                </CardTitle>
                <CardDescription>Capture leads e monitore mençÃµes no Instagram</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={instagramConnected ? "default" : "secondary"}
                      className={instagramConnected ? "bg-green-500" : ""}
                    >
                      {instagramConnected ? "Conectado" : "Desconectado"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {instagramConnected ? "@arenacoligados" : "Não configurado"}
                    </span>
                  </div>
                  <Button
                    variant={instagramConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationToggle("instagram")}
                    className={
                      instagramConnected
                        ? "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        : "bg-orange-500 hover:bg-orange-600"
                    }
                  >
                    {instagramConnected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
                {instagramConnected && (
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> API conectada
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> Captura de comentários ativa
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" /> DMs sendo monitoradas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5" />
                  Mercado Pago
                </CardTitle>
                <CardDescription>Processe pagamentos PIX e cartão automaticamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={mercadoPagoConnected ? "default" : "secondary"}
                      className={mercadoPagoConnected ? "bg-green-500" : ""}
                    >
                      {mercadoPagoConnected ? "Conectado" : "Desconectado"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {mercadoPagoConnected ? "Conta verificada" : "Não configurado"}
                    </span>
                  </div>
                  <Button
                    variant={mercadoPagoConnected ? "outline" : "default"}
                    onClick={() => handleIntegrationToggle("mercadopago")}
                    className={
                      mercadoPagoConnected
                        ? "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                        : "bg-orange-500 hover:bg-orange-600"
                    }
                  >
                    {mercadoPagoConnected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
                {!mercadoPagoConnected && (
                  <div className="text-sm text-yellow-600">
                    <p className="flex items-center gap-2">
                      <X className="h-4 w-4" /> Configure para aceitar pagamentos automáticos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  n8n AutomaçÃµes
                </CardTitle>
                <CardDescription>Workflows automáticos para leads e cobrança</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">
                      5 Workflows Ativos
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
                  >
                    Gerenciar
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Funil de leads Instagram â†’ WhatsApp
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Cobrança automática de mensalidades
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Lembretes de aula experimental
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Follow-up pós-reserva
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> Relatórios automáticos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Building className="h-5 w-5" />
                  InformaçÃµes da Arena
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="arena-name">Nome da Arena</Label>
                    <Input
                      id="arena-name"
                      value={arenaInfo.name}
                      onChange={(e) => setArenaInfo({ ...arenaInfo, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arena-phone">Telefone</Label>
                    <Input
                      id="arena-phone"
                      value={arenaInfo.phone}
                      onChange={(e) => setArenaInfo({ ...arenaInfo, phone: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arena-email">Email</Label>
                    <Input
                      id="arena-email"
                      value={arenaInfo.email}
                      onChange={(e) => setArenaInfo({ ...arenaInfo, email: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arena-cnpj">CNPJ</Label>
                    <Input
                      id="arena-cnpj"
                      value={arenaInfo.cnpj}
                      onChange={(e) => setArenaInfo({ ...arenaInfo, cnpj: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arena-address">Endereço Completo</Label>
                  <Input
                    id="arena-address"
                    value={arenaInfo.address}
                    onChange={(e) => setArenaInfo({ ...arenaInfo, address: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleSaveArenaInfo} className="bg-orange-500 hover:bg-orange-600">
                  Salvar AlteraçÃµes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Horário de Funcionamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {horarios.map((horario, index) => (
                    <div key={horario.dia} className="flex items-center gap-4">
                      <div className="w-32">
                        <Label className="text-white">{horario.dia}</Label>
                      </div>
                      <Input
                        className="w-24 bg-gray-700 border-gray-600 text-white"
                        value={horario.inicio}
                        onChange={(e) => {
                          const newHorarios = [...horarios]
                          newHorarios[index].inicio = e.target.value
                          setHorarios(newHorarios)
                        }}
                      />
                      <span className="text-white">Ã s</span>
                      <Input
                        className="w-24 bg-gray-700 border-gray-600 text-white"
                        value={horario.fim}
                        onChange={(e) => {
                          const newHorarios = [...horarios]
                          newHorarios[index].fim = e.target.value
                          setHorarios(newHorarios)
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveHorarios} className="bg-orange-500 hover:bg-orange-600">
                  Salvar Horários
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Preferências de Notificação</CardTitle>
                <CardDescription>Configure como e quando receber notificaçÃµes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">NotificaçÃµes por Email</Label>
                    <p className="text-sm text-muted-foreground">Receba resumos diários e alertas importantes</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={(value) => handleNotificationChange("email", value)}
                  />
                </div>

                <Separator className="bg-gray-600" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">NotificaçÃµes por SMS</Label>
                    <p className="text-sm text-muted-foreground">Alertas urgentes via mensagem de texto</p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={(value) => handleNotificationChange("sms", value)}
                  />
                </div>

                <Separator className="bg-gray-600" />

                <div className="space-y-4">
                  <Label className="text-white">Tipos de Notificação</Label>
                  <div className="space-y-3">
                    {[
                      { label: "Nova reserva", checked: true },
                      { label: "Cancelamento de reserva", checked: true },
                      { label: "Pagamento aprovado", checked: true },
                      { label: "Pagamento pendente", checked: false },
                      { label: "Novo lead capturado", checked: true },
                      { label: "Aula experimental agendada", checked: true },
                      { label: "Relatório semanal", checked: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center space-x-2">
                        <Switch defaultChecked={item.checked} />
                        <Label className="text-white">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Usuários do Sistema</CardTitle>
                <CardDescription>Gerencie acessos e permissÃµes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      nome: "Admin Principal",
                      email: "admin@arenacoligados.com",
                      tipo: "Administrador",
                      status: "Ativo",
                    },
                    { nome: "João Silva", email: "joao@arenacoligados.com", tipo: "Professor", status: "Ativo" },
                    { nome: "Maria Santos", email: "maria@arenacoligados.com", tipo: "Professor", status: "Ativo" },
                    { nome: "Pedro Costa", email: "pedro@arenacoligados.com", tipo: "Professor", status: "Inativo" },
                  ].map((usuario) => (
                    <div
                      key={usuario.email}
                      className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-700"
                    >
                      <div>
                        <p className="font-medium text-white">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={usuario.tipo === "Administrador" ? "default" : "secondary"}
                          className={usuario.tipo === "Administrador" ? "bg-orange-500" : ""}
                        >
                          {usuario.tipo}
                        </Badge>
                        <Badge
                          variant={usuario.status === "Ativo" ? "default" : "secondary"}
                          className={usuario.status === "Ativo" ? "bg-green-500" : ""}
                        >
                          {usuario.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={handleAddUser} className="bg-orange-500 hover:bg-orange-600">
                    Adicionar Usuário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

