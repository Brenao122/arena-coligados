"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn, Menu, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sobre Nós", href: "/sobre-nos" },
  { name: "Mídia Kit", href: "/midia-kit" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados"
              width={48}
              height={48}
              className="rounded-full ring-2 ring-orange-500/50 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                Arena Coligados
              </h1>
              <p className="text-xs text-gray-400 font-medium">Gestão Esportiva</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-400",
                  pathname === item.href ? "text-orange-400" : "text-gray-300",
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-base font-medium transition-colors hover:text-orange-400",
                  pathname === item.href ? "text-orange-400" : "text-gray-300",
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false)
                window.location.href = "/login"
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
