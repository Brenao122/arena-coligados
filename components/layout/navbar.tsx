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
  { name: "Sobre Nós", href: "/sobre-nos" },
  { name: "Mídia Kit", href: "/midia-kit" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-[#FF6B47] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFD966] rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <Image
                src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
                alt="Arena Coligados"
                width={60}
                height={60}
                className="rounded-full ring-4 ring-[#FF6B47] shadow-lg relative z-10"
                priority
                sizes="60px"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-[#FF6B47] to-[#FF8566] bg-clip-text text-transparent">
                Arena Coligados
              </h1>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Gestão Esportiva</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-black uppercase tracking-wider transition-colors hover:text-[#FF6B47]",
                  pathname === item.href ? "text-[#FF6B47]" : "text-gray-700",
                )}
                prefetch={true}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={() => (window.location.href = "/login")}
              className="btn-primary !px-8 !py-3 text-sm"
            >
              <LogIn className="h-4 w-4 mr-2" />
              LOGIN
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#FF6B47]"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
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
              LOGIN
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
