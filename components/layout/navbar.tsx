"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogIn, Menu, X, ChevronDown, Instagram, Facebook, MessageCircle } from 'lucide-react'
import Image from "next/image"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { 
    name: "Sobre", 
    href: "/sobre-nos",
    submenu: [
      { name: "Nossa História", href: "/sobre-nos#historia" },
      { name: "Missão, Visão e Valores", href: "/sobre-nos#mvv" },
      { name: "Nosso Time", href: "/sobre-nos#time" },
    ]
  },
  { name: "Mídia Kit", href: "/midia-kit" },
  { name: "Nossas Redes Sociais", href: "/redes-sociais" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sobreMenuOpen, setSobreMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b-4 border-[#FFD966] shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg"
              alt="Arena Coligados"
              width={50}
              height={50}
              className="rounded-full transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-[#FF6B47]/30"
              priority
            />
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-[#FF6B47] to-[#FFD966] bg-clip-text text-transparent">
                Arena Coligados
              </h1>
              <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Gestão Esportiva</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              item.submenu ? (
                <div 
                  key={item.name}
                  className="relative group"
                >
                  <button
                    className={cn(
                      "text-sm font-black uppercase tracking-wider transition-all hover:scale-110 flex items-center gap-1",
                      pathname === item.href || pathname.includes('/sobre-nos')
                        ? "text-[#FF6B47] drop-shadow-lg" 
                        : "text-gray-700 hover:text-[#FF6B47]",
                    )}
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-[#FFD966] py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-[#FFF5E6] hover:text-[#FF6B47] transition-colors uppercase tracking-wide"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-black uppercase tracking-wider transition-all hover:scale-110",
                    pathname === item.href 
                      ? "text-[#FF6B47] drop-shadow-lg" 
                      : "text-gray-700 hover:text-[#FF6B47]",
                  )}
                  prefetch={true}
                >
                  {item.name}
                </Link>
              )
            ))}
            <Button
              onClick={() => window.open("https://wa.me/5562999999999", "_blank")}
              className="bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider px-6 py-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Fale Conosco
            </Button>
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
        <div className="md:hidden bg-gradient-to-b from-white to-[#FFF5E6] border-t-4 border-[#FFD966] shadow-2xl">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              item.submenu ? (
                <div key={item.name} className="space-y-2">
                  <button
                    onClick={() => setSobreMenuOpen(!sobreMenuOpen)}
                    className={cn(
                      "flex items-center justify-between w-full text-base font-black uppercase tracking-wider transition-colors hover:text-[#FF6B47]",
                      pathname === item.href || pathname.includes('/sobre-nos') ? "text-[#FF6B47]" : "text-gray-700",
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      sobreMenuOpen && "rotate-180"
                    )} />
                  </button>
                  {sobreMenuOpen && (
                    <div className="pl-4 space-y-2 border-l-4 border-[#FFD966]">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-sm font-bold text-gray-700 hover:text-[#FF6B47] uppercase tracking-wide py-2"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
              )
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false)
                window.open("https://wa.me/5562999999999", "_blank")
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider rounded-full text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Fale Conosco
            </Button>
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
