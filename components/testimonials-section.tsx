"use client"

import { useEffect, useRef, useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: "Amira Benali",
    role: "Fondatrice",
    company: "Maison Amira - Casablanca",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "Ytech Solutions a transforme notre boutique en ligne. Les ventes ont augmente de 250% en seulement 6 mois. L'equipe est professionnelle, reactive et vraiment a l'ecoute de nos besoins. Je recommande vivement !",
    rating: 5,
    project: "E-Commerce Mode"
  },
  {
    name: "Karim Fassi",
    role: "Associe gerant",
    company: "Cabinet Fassi & Associes - Rabat",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "Un site vitrine elegant qui reflete parfaitement notre image de cabinet juridique serieux. La prise de rendez-vous en ligne a revolutionne notre organisation. Excellent travail !",
    rating: 5,
    project: "Site Vitrine Juridique"
  },
  {
    name: "Leila Bennani",
    role: "Directrice Medicale",
    company: "Clinique Atlas - Casablanca",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "La plateforme de teleconsultation developpee par Ytech depasse toutes nos attentes. Interface intuitive, performances excellentes et support technique irreprochable. Nos patients adorent !",
    rating: 5,
    project: "Application Medicale"
  },
  {
    name: "Omar Tazi",
    role: "Chef proprietaire",
    company: "Le Marocain Gastronomique - Marrakech",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Notre nouveau site avec reservation en ligne a multiplie par 3 nos reservations. Le design capture parfaitement l'ambiance de notre etablissement. Merci Ytech !",
    rating: 5,
    project: "Site Restaurant"
  },
  {
    name: "Youssef Alami",
    role: "CEO",
    company: "TaskFlow Technologies - Casablanca",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "Ytech a ete un partenaire technique exceptionnel pour notre startup. Leur expertise nous a permis de lancer rapidement un produit de qualite qui a attire 10 000 utilisateurs.",
    rating: 5,
    project: "Plateforme SaaS"
  },
  {
    name: "Fatima Zahra Idrissi",
    role: "Directrice Commerciale",
    company: "Casa Prestige Immobilier - Casablanca",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    content: "La plateforme immobiliere avec visite virtuelle 3D nous a permis de nous demarquer de la concurrence. Un investissement qui a largement porte ses fruits avec +400% de visites.",
    rating: 5,
    project: "Plateforme Immobiliere"
  },
]

const clientLogos = [
  "Maison Amira", "Cabinet Fassi", "Clinique Atlas", "TaskFlow", "Casa Prestige", "Le Marocain"
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Temoignages
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-balance">
            Ce que disent{' '}
            <span className="gradient-text">nos clients</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Decouvrez les retours de nos clients marocains satisfaits et leurs success stories.
          </p>
        </div>

        {/* Main testimonial carousel */}
        <div className={`max-w-4xl mx-auto mb-12 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="relative">
            {/* Quote icon */}
            <Quote className="absolute -top-6 -left-6 w-16 h-16 text-primary/10" />

            {/* Testimonial card */}
            <div className="glass rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Author info */}
                <div className="flex-shrink-0 text-center md:text-left">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20 mx-auto md:mx-0">
                    <img
                      src={testimonials[activeIndex].image}
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold mt-4">{testimonials[activeIndex].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</p>
                  <p className="text-sm text-primary">{testimonials[activeIndex].company}</p>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4 justify-center md:justify-start">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl leading-relaxed mb-4 text-center md:text-left">
                    &ldquo;{testimonials[activeIndex].content}&rdquo;
                  </blockquote>

                  {/* Project tag */}
                  <div className="flex justify-center md:justify-start">
                    <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">
                      Projet: {testimonials[activeIndex].project}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="p-3 glass rounded-full hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setActiveIndex(index)
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeIndex === index 
                        ? "w-8 bg-primary" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-3 glass rounded-full hover:bg-secondary/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Client logos */}
        <div className={`mt-20 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Ils nous font confiance au Maroc
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {clientLogos.map((logo, index) => (
              <div
                key={index}
                className="text-xl md:text-2xl font-bold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {[
            { value: "98%", label: "Clients satisfaits" },
            { value: "150+", label: "Projets au Maroc" },
            { value: "4.9/5", label: "Note moyenne" },
            { value: "24h", label: "Temps de reponse" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass rounded-xl">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
