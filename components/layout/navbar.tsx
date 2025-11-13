"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogIn, Menu, X } from 'lucide-react'
import Image from "next/image"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sobre", href: "/sobre-nos" },
  { name: "Mídia Kit", href: "/midia-kit" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-28">
          <Link href="/" className="flex items-center gap-4 group">
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados"
              width={50}
              height={50}
              className="rounded-full transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="50px"
            />
            <div>
              <h1 className="text-xl font-semibold uppercase tracking-wider text-gray-900">
                Arena Coligados
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-light">Gestão Esportiva</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium uppercase tracking-widest transition-colors",
                  pathname === item.href 
                    ? "text-[#FF6B47]" 
                    : "text-gray-600 hover:text-[#FF6B47]",
                )}
                prefetch={true}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={() => (window.location.href = "/login")}
              className="btn-primary !px-6 !py-3"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#FF6B47] transition-colors"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-[#FFD966]">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block text-base font-black uppercase tracking-wider transition-colors hover:text-[#FF6B47]",
                  pathname === item.href ? "text-[#FF6B47]" : "text-gray-700",
                )}
                prefetch={true}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false)
                window.location.href = "/login"
              }}
              className="w-full btn-primary text-sm"
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
