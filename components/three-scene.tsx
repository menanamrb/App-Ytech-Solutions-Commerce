"use client"

import { useEffect, useRef } from 'react'

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create floating 3D elements with pure CSS
    const container = containerRef.current
    const elements: HTMLDivElement[] = []

    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div')
      element.className = 'absolute rounded-lg opacity-20'
      element.style.width = `${Math.random() * 100 + 50}px`
      element.style.height = `${Math.random() * 100 + 50}px`
      element.style.left = `${Math.random() * 100}%`
      element.style.top = `${Math.random() * 100}%`
      element.style.background = `linear-gradient(135deg, 
        oklch(0.65 0.18 250 / ${Math.random() * 0.3 + 0.1}), 
        oklch(0.55 0.22 220 / ${Math.random() * 0.3 + 0.1}))`
      element.style.transform = `perspective(1000px) rotateX(${Math.random() * 60}deg) rotateY(${Math.random() * 60}deg)`
      element.style.animation = `float ${Math.random() * 4 + 4}s ease-in-out infinite`
      element.style.animationDelay = `${Math.random() * 2}s`
      element.style.borderRadius = Math.random() > 0.5 ? '50%' : '12px'
      container.appendChild(element)
      elements.push(element)
    }

    return () => {
      elements.forEach(el => el.remove())
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ perspective: '1000px' }}
    />
  )
}
