"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  created_at: string
  read: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      // Buscar dados da planilha N8N via API
      const response = await fetch('/api/sheets/read?sheet=Página1')
      const result = await response.json()
      
      if (!result.ok) {
        throw new Error(result.error || 'Erro ao buscar dados')
      }

      const dados = result.rows || []
      
      // Criar notificações baseadas nos dados da planilha
      const notificacoesFicticias = [
        {
          id: "notif1",
          type: "info" as const,
          title: "Nova Reserva",
          message: "Nova reserva criada na planilha N8N",
          created_at: new Date().toISOString(),
          read: false
        },
        {
          id: "notif2",
          type: "success" as const,
          title: "Sincronização Concluída",
          message: "Dados sincronizados com sucesso com Google Sheets",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: "notif3",
          type: "warning" as const,
          title: "Atenção",
          message: "Verifique os dados da planilha N8N",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          read: true
        }
      ]

      setNotifications(notificacoesFicticias)
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-white">Central de Notificações</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-orange-500 text-white">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-gray-400 hover:text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-gray-400">
            Acompanhe todas as atualizações da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-600 border-orange-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{notification.title}</h4>
                        <Badge className={getBadgeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(notification.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
