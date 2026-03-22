"use client"

import { useEffect, useRef, useState } from 'react'
import { 
  Globe, 
  ShoppingCart, 
  Wrench, 
  Server, 
  Palette, 
  Smartphone,
  Search,
  Shield
} from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: "Sites Vitrines",
    description: "Des sites web élégants et performants qui captivent vos visiteurs et transforment votre présence en ligne.",
    features: ["Design sur mesure", "Responsive", "SEO optimisé"]
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    description: "Boutiques en ligne complètes avec gestion des stocks, paiements sécurisés et expérience utilisateur optimale.",
    features: ["Paiements sécurisés", "Gestion stocks", "Analytics"]
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description: "Support technique continu, mises à jour régulières et surveillance 24/7 pour la tranquillité d'esprit.",
    features: ["Support 24/7", "Sauvegardes", "Mises à jour"]
  },
  {
    icon: Server,
    title: "Hébergement",
    description: "Infrastructure cloud haute performance avec certificat SSL, CDN mondial et temps de chargement ultra-rapide.",
    features: ["SSL gratuit", "CDN mondial", "99.9% uptime"]
  },
  {
    icon: Palette,
    title: "Design UI/UX",
    description: "Interfaces utilisateur intuitives et design moderne qui reflètent l'identité unique de votre marque.",
    features: ["Prototypage", "Tests utilisateurs", "Design system"]
  },
  {
    icon: Smartphone,
    title: "Applications Web",
    description: "Applications web progressives et solutions SaaS sur mesure pour digitaliser vos processus métier.",
    features: ["PWA", "API REST", "Scalable"]
  },
  {
    icon: Search,
    title: "SEO & Marketing",
    description: "Stratégies de référencement naturel et campagnes marketing pour augmenter votre visibilité.",
    features: ["Audit SEO", "Content marketing", "Analytics"]
  },
  {
    icon: Shield,
    title: "Sécurité Web",
    description: "Protection avancée contre les menaces, audits de sécurité et conformité RGPD.",
    features: ["Firewall", "Anti-DDoS", "RGPD"]
  },
]

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  return (
    <section id="services" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Nos Services
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Solutions digitales{' '}
            <span className="gradient-text">complètes</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            De la conception à la mise en ligne, nous vous accompagnons à chaque étape 
            de votre transformation digitale avec des solutions sur mesure.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group glass rounded-2xl p-6 card-3d hover:bg-secondary/50 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, i) => (
                  <span 
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
