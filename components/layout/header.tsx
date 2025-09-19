"use client"

import { Bell, MessageSquare, Search, User, Sun, Moon, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth-simple"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"

interface HeaderProps {
  onChatToggle: () => void
  chatOpen: boolean
}

export function Header({ onChatToggle, chatOpen }: HeaderProps) {
  const { profile, signOut } = useAuth()
  const { theme, actualTheme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Buscar notificações do Google Sheets
        const response = await fetch('/api/sheets/read?sheet=Página1')
        const result = await response.json()
        
        if (result.ok && result.rows) {
          // Filtrar notificações (assumindo que estão na planilha)
          const notificationsData = result.rows.filter((row: any) => 
            row.tipo === 'notificacao' || row.user_id === profile?.id
          )
          setNotifications(notificationsData)
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    if (profile?.id) {
      fetchNotifications()
    }
  }, [profile?.id])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'professor':
        return 'Professor'
      case 'cliente':
        return 'Cliente'
      default:
        return 'Usuário'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500'
      case 'professor':
        return 'bg-blue-500'
      case 'cliente':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <header className="fixed top-0 left-16 lg:left-80 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reservas, clientes..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                {actualTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className="text-gray-300 hover:bg-gray-700"
              >
                <Sun className="h-4 w-4 mr-2" />
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className="text-gray-300 hover:bg-gray-700"
              >
                <Moon className="h-4 w-4 mr-2" />
                Escuro
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
                className="text-gray-300 hover:bg-gray-700"
              >
                <Monitor className="h-4 w-4 mr-2" />
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-400 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500">
                {notifications.length}
              </Badge>
            )}
          </Button>

          {/* Chat Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onChatToggle}
            className={`text-gray-400 hover:text-white ${chatOpen ? 'bg-orange-500/20 text-orange-400' : ''}`}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{profile?.full_name || 'Usuário'}</div>
                  <div className="text-xs text-gray-400">
                    {getRoleDisplayName(profile?.role || 'cliente')}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 w-56">
              <div className="px-3 py-2 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{profile?.full_name || 'Usuário'}</div>
                    <div className="text-xs text-gray-400">{profile?.email}</div>
                    <Badge className={`${getRoleColor(profile?.role || 'cliente')} text-white text-xs mt-1`}>
                      {getRoleDisplayName(profile?.role || 'cliente')}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                <Palette className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-400 hover:bg-red-900/20"
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}