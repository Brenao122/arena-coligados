"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0.1, rootMargin = "50px", freezeOnceVisible = true } = options
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If already visible and frozen, don't observe
    if (freezeOnceVisible && isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)

        // Disconnect if frozen and visible
        if (freezeOnceVisible && entry.isIntersecting) {
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, freezeOnceVisible, isVisible])

  return [ref, isVisible]
}
