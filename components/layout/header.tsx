"use client"

import { Bell, MessageSquare, Search, User, Sun, Moon, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
  onChatToggle: () => void
  chatOpen: boolean
}

const mockNotifications = [
  { id: "1", title: "Nova reserva", time: "5 min" },
  { id: "2", title: "Pagamento aprovado", time: "10 min" },
]

export function Header({ onChatToggle, chatOpen }: HeaderProps) {
  const { profile } = useAuth()
  const { theme, actualTheme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", profile?.id)
          .eq("read", false)
          .order("created_at", { ascending: false })
          .limit(5)

        setNotifications(data || [])
      } catch (error) {
        console.error("Erro ao buscar notificações:", error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    if (profile?.id) {
      fetchNotifications()
    }
  }, [profile?.id])

  const getThemeIcon = () => {
    if (theme === "system") return <Monitor className="h-4 w-4" />
    if (theme === "dark") return <Moon className="h-4 w-4" />
    return <Sun className="h-4 w-4" />
  }

  const getThemeLabel = () => {
    if (theme === "system") return "Sistema"
    if (theme === "dark") return "Escuro"
    return "Claro"
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-80 z-40 bg-gray-900/95 dark:bg-gray-900/95 light:bg-white/95 backdrop-blur-sm border-b border-gray-800 dark:border-gray-800 light:border-gray-200 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 light:text-gray-600 h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 transition-colors duration-300"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Selector - Melhorado com dropdown e opções mais visíveis */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-200 border border-gray-700 dark:border-gray-700 light:border-gray-300 transition-all duration-300"
              >
                <Palette className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700 hidden sm:block">
                  {getThemeLabel()}
                </span>
                <Badge className="ml-1 bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0.5">
                  {actualTheme === "dark" ? "🌙" : "☀️"}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200 transition-colors duration-300"
            >
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={`flex items-center space-x-2 ${theme === "system" ? "bg-orange-500/20 text-orange-400" : "text-gray-300 dark:text-gray-300 light:text-gray-700"} hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200`}
              >
                <Monitor className="h-4 w-4" />
                <span>Sistema</span>
                {theme === "system" && <Badge className="ml-auto bg-orange-500 text-xs">Ativo</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={`flex items-center space-x-2 ${theme === "dark" ? "bg-orange-500/20 text-orange-400" : "text-gray-300 dark:text-gray-300 light:text-gray-700"} hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200`}
              >
                <Moon className="h-4 w-4" />
                <span>Tema Escuro</span>
                {theme === "dark" && <Badge className="ml-auto bg-orange-500 text-xs">Ativo</Badge>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={`flex items-center space-x-2 ${theme === "light" ? "bg-orange-500/20 text-orange-400" : "text-gray-300 dark:text-gray-300 light:text-gray-700"} hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200`}
              >
                <Sun className="h-4 w-4" />
                <span>Tema Claro</span>
                {theme === "light" && <Badge className="ml-auto bg-orange-500 text-xs">Ativo</Badge>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-300 dark:text-gray-300 light:text-gray-700" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-orange-500 text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200 transition-colors duration-300"
            >
              <div className="p-3 border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
                <h3 className="font-semibold text-white dark:text-white light:text-gray-900">Notificações</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-3 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white dark:text-white light:text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500">
                      {notification.time} atrás
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chat Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onChatToggle}
            className={`relative transition-colors duration-200 ${chatOpen ? "bg-orange-500/20 text-orange-400" : "text-gray-300 dark:text-gray-300 light:text-gray-700"}`}
          >
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-green-500 text-xs">2</Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700 hidden md:block">
                  {profile?.name || "Usuário"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200 transition-colors duration-300"
            >
              <DropdownMenuItem className="text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200">
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200">
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100 transition-colors duration-200">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
