"use client"

import type React from "react"

import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    freezeOnceVisible: true,
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay * 100}ms` }}
    >
      {children}
    </div>
  )
}
