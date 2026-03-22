"use client"

import { useEffect, useState } from 'react'
import { ArrowRight, Code2, Sparkles, Users, Trophy, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThreeScene } from './three-scene'
import Link from 'next/link'

const stats = [
  { icon: Users, value: "150+", label: "Clients au Maroc" },
  { icon: Trophy, value: "300+", label: "Projets Livres" },
  { icon: Star, value: "4.9/5", label: "Note Moyenne" },
]

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      <ThreeScene />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(oklch(0.65 0.18 250) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.65 0.18 250) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              Agence digitale de confiance depuis 2020
            </span>
          </div>

          {/* Main Heading */}
          <h1 
            className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-foreground">Transformez votre</span>
            <br />
            <span className="gradient-text">Vision Digitale</span>
            <br />
            <span className="text-foreground">en Réalité</span>
          </h1>

          {/* Subtitle */}
          <p 
            className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Nous créons des expériences web exceptionnelles pour les PME.
            Sites vitrines, e-commerce, maintenance et hébergement - tout ce dont vous avez besoin pour réussir en ligne.
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex justify-center transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Link href="#packs">
              <Button size="lg" className="glow group px-8 py-6 text-lg hover:scale-105 transition-all">
                Découvrir nos packs
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Spacer */}
          <div className="h-16"></div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-6 card-3d"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
