"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import {
  Calendar,
  Users,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  CreditCard,
  UserCheck,
  GraduationCap,
  Database,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "professor", "cliente"] },
  { name: "Reservas", href: "/dashboard/reservas", icon: Calendar, roles: ["admin", "professor", "cliente"] },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users, roles: ["admin", "professor"] },
  { name: "Quadras", href: "/dashboard/quadras", icon: MapPin, roles: ["admin"] },
  { name: "Professores", href: "/dashboard/professores", icon: GraduationCap, roles: ["admin"] },
  { name: "Pagamentos", href: "/dashboard/pagamentos", icon: CreditCard, roles: ["admin"] },
  { name: "Leads", href: "/dashboard/leads", icon: UserCheck, roles: ["admin"] },
  { name: "Relatórios", href: "/dashboard/relatorios", icon: BarChart3, roles: ["admin", "professor"] },
  { name: "Diagnóstico", href: "/dashboard/diagnostico", icon: Database, roles: ["admin"] },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings, roles: ["admin"] },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const getDashboardHref = () => {
    if (profile?.role === "professor") return "/dashboard/dashboard-professor"
    if (profile?.role === "cliente") return "/dashboard/dashboard-aluno"
    return "/dashboard/dashboard-admin"
  }

  const filteredNavigation = navigation
    .map((item) => {
      if (item.name === "Dashboard") {
        return { ...item, href: getDashboardHref() }
      }
      return item
    })
    .filter((item) => {
      // Skip filtering during build/static generation
      if (typeof window === "undefined") {
        return true // Show all items during build
      }

      const userRole = profile?.role || "admin"
      return item.roles.includes(userRole)
    })

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-80 flex-col bg-gray-900 shadow-2xl border-r border-gray-700">
          <SidebarContent
            navigation={filteredNavigation}
            pathname={pathname}
            profile={profile}
            signOut={signOut}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <SidebarContent navigation={filteredNavigation} pathname={pathname} profile={profile} signOut={signOut} />
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-gray-700 text-white border border-gray-600"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

function SidebarContent({
  navigation,
  pathname,
  profile,
  signOut,
  onClose,
}: {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
  }>
  pathname: string
  profile: { full_name?: string; role?: string } | null
  signOut: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-gray-900 px-6 pb-4 border-r border-gray-700">
      <div className="flex h-20 shrink-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-arena-coligados.png"
            alt="Arena Coligados"
            width={48}
            height={48}
            className="rounded-full shadow-lg border-2 border-orange-500"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
              Arena Coligados
            </h1>
            <p className="text-xs text-gray-400 font-medium">Gestão Esportiva</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-800 text-gray-300">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex flex-1 flex-col">
        <ScrollArea className="flex-1">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg border border-orange-400/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent",
                    "group flex gap-x-3 rounded-xl p-4 text-sm leading-6 font-medium transition-all duration-200 border",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white",
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>

        <div className="mt-auto">
          <div className="flex items-center gap-x-4 px-4 py-4 text-sm font-medium bg-gray-800 rounded-xl border border-gray-600 shadow-lg">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile?.full_name || "Admin"}</p>
              <p className="text-xs text-gray-400 capitalize font-medium">{profile?.role || "admin"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start text-gray-300 hover:text-red-400 hover:bg-gray-800 mt-3 rounded-xl transition-all duration-200 border border-transparent hover:border-red-400/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </nav>
    </div>
  )
}

