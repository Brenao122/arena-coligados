"use client"

import { Bell, Check, X, Clock, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "error" | "info"
  priority: "low" | "normal" | "high" | "urgent"
  read: boolean
  created_at: string
  data?: any
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nova Reserva Confirmada",
    message: "João Silva confirmou reserva para Quadra 1",
    type: "success",
    priority: "normal",
    read: false,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    title: "Pagamento Pendente",
    message: "Pagamento de R$ 150,00 aguardando confirmação",
    type: "warning",
    priority: "high",
    read: false,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "3",
    title: "Manutenção Agendada",
    message: "Quadra 3 em manutenção amanhã às 14h",
    type: "info",
    priority: "normal",
    read: true,
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    urgent: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotifications(mockNotifications)

      // Calculate stats
      const total = mockNotifications.length
      const unread = mockNotifications.filter((n) => !n.read).length
      const urgent = mockNotifications.filter((n) => n.priority === "urgent").length

      setStats({
        total,
        unread,
        read: total - unread,
        urgent,
      })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      setStats((prev) => ({
        ...prev,
        unread: prev.unread - 1,
        read: prev.read + 1,
      }))
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setStats((prev) => ({
        ...prev,
        unread: 0,
        read: prev.total,
      }))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        unread: prev.unread - (notifications.find((n) => n.id === notificationId)?.read ? 0 : 1),
      }))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hora${Math.floor(diffInMinutes / 60) > 1 ? "s" : ""} atrás`
    return `${Math.floor(diffInMinutes / 1440)} dia${Math.floor(diffInMinutes / 1440) > 1 ? "s" : ""} atrás`
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
      default:
        return <Bell className="h-4 w-4 text-gray-400" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500"
      case "warning":
        return "border-l-orange-500"
      case "error":
        return "border-l-red-500"
      case "info":
        return "border-l-blue-500"
      default:
        return "border-l-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Carregando notificações...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Central de Notificações
          </h1>
          <p className="text-gray-400 mt-1">Acompanhe todas as atualizações da arena</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            onClick={markAllAsRead}
            disabled={stats.unread === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Bell className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.unread}</p>
                <p className="text-sm text-gray-400">Não lidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.read}</p>
                <p className="text-sm text-gray-400">Lidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.urgent}</p>
                <p className="text-sm text-gray-400">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-400" />
            <span>Notificações Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center text-gray-400 py-8">Nenhuma notificação encontrada</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${getBorderColor(notification.type)} ${
                      notification.read ? "bg-gray-800/50" : "bg-gray-700/50"
                    } transition-colors hover:bg-gray-700`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${notification.read ? "text-gray-300" : "text-white"}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && <Badge className="bg-orange-500 text-white text-xs">Nova</Badge>}
                            {notification.priority === "urgent" && (
                              <Badge className="bg-red-500 text-white text-xs">Urgente</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(notification.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
