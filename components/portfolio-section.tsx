"use client"

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, ArrowRight, X, Calendar, Users, Globe, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  client: string
  category: string
  description: string
  fullDescription: string
  image: string
  images: string[]
  tags: string[]
  metrics: string
  results: string[]
  testimonial?: {
    text: string
    author: string
    role: string
  }
  year: string
  duration: string
  link?: string
}

const projects: Project[] = [
  {
    id: "fashion-store",
    title: "Mode & Style Boutique",
    client: "Maison Amira",
    category: "E-Commerce",
    description: "Boutique en ligne complete avec plus de 500 produits et systeme de paiement multi-devises.",
    fullDescription: "Maison Amira est une marque de mode marocaine haut de gamme. Nous avons cree une plateforme e-commerce complete permettant de gerer leur catalogue de plus de 500 references, avec un systeme de paiement securise et une experience d'achat premium.",
    image: "https://lh3.googleusercontent.com/p/AF1QipN_qKqYvZ3X8e6vF7wT9wX2yL7zK1mB3s4tD5rE=w600-h400-p",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=500&fit=crop"
    ],
    tags: ["Next.js", "Stripe", "CMS"],
    metrics: "+250% ventes",
    results: [
      "Augmentation de 250% des ventes en ligne",
      "Taux de conversion ameliore de 3.2%",
      "Temps de chargement reduit a 1.2s",
      "Integration paiement CMI reussie"
    ],
    testimonial: {
      text: "Ytech a transforme notre presence en ligne. Les ventes ont explose depuis le lancement du nouveau site.",
      author: "Amira Benali",
      role: "Fondatrice, Maison Amira"
    },
    year: "2024",
    duration: "8 semaines",
    link: "#"
  },
  {
    id: "law-firm",
    title: "Cabinet Juridique Fassi",
    client: "Cabinet Fassi & Associes",
    category: "Site Vitrine",
    description: "Site institutionnel moderne avec prise de rendez-vous en ligne et espace client securise.",
    fullDescription: "Le Cabinet Fassi & Associes est l'un des cabinets juridiques les plus reputes de Casablanca. Nous avons developpe un site institutionnel elegant avec un systeme de prise de rendez-vous en ligne et un portail client securise pour le suivi des dossiers.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop"
    ],
    tags: ["Next.js", "Calendly", "Portal"],
    metrics: "+180% leads",
    results: [
      "180% d'augmentation des demandes de contact",
      "Reduction de 60% des appels telephoniques",
      "Espace client adopte par 95% des clients",
      "Referencement en 1ere page Google"
    ],
    testimonial: {
      text: "Un site qui reflete parfaitement notre expertise et notre serieux. Nos clients apprecient particulierement l'espace en ligne.",
      author: "Maitre Karim Fassi",
      role: "Associe gerant"
    },
    year: "2024",
    duration: "6 semaines"
  },
  {
    id: "restaurant",
    title: "Restaurant Le Marocain",
    client: "Le Marocain Gastronomique",
    category: "Site Vitrine",
    description: "Experience immersive avec reservation en ligne et menu digital interactif.",
    fullDescription: "Le Marocain Gastronomique est un restaurant etoile situe a Casablanca. Nous avons cree une experience digitale immersive avec des visuels haute qualite, un systeme de reservation en temps reel et un menu interactif multilingue.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=500&fit=crop"
    ],
    tags: ["Vue.js", "Animation", "Reservation"],
    metrics: "+320% reservations",
    results: [
      "320% d'augmentation des reservations en ligne",
      "Reduction de 45% des no-shows",
      "Menu QR code scanne 5000+ fois/mois",
      "Note Google amelioree a 4.9/5"
    ],
    testimonial: {
      text: "Le site capture parfaitement l'ambiance de notre etablissement. Les reservations en ligne ont change notre quotidien.",
      author: "Chef Omar Tazi",
      role: "Chef proprietaire"
    },
    year: "2023",
    duration: "5 semaines"
  },
  {
    id: "saas-startup",
    title: "TaskFlow Pro",
    client: "TaskFlow Technologies",
    category: "Application Web",
    description: "Plateforme de gestion de projet avec tableaux Kanban et collaboration temps reel.",
    fullDescription: "TaskFlow Pro est une startup marocaine developpant un outil SaaS de gestion de projet. Nous avons concu et developpe leur plateforme complete avec tableaux Kanban, chat integre, et fonctionnalites de collaboration en temps reel.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop"
    ],
    tags: ["React", "Node.js", "WebSocket"],
    metrics: "10k+ utilisateurs",
    results: [
      "10,000+ utilisateurs actifs",
      "Temps de reponse API < 100ms",
      "99.9% de disponibilite",
      "Levee de fonds de 2M DHS"
    ],
    testimonial: {
      text: "Ytech a ete un partenaire technique exceptionnel. Leur expertise nous a permis de lancer rapidement un produit de qualite.",
      author: "Youssef Alami",
      role: "CEO, TaskFlow"
    },
    year: "2024",
    duration: "4 mois"
  },
  {
    id: "real-estate",
    title: "Immobilier Premium Casa",
    client: "Casa Prestige Immobilier",
    category: "E-Commerce",
    description: "Plateforme de recherche immobiliere avec visite virtuelle 3D et estimation en ligne.",
    fullDescription: "Casa Prestige Immobilier est une agence immobiliere de luxe. Nous avons cree une plateforme complete avec recherche avancee, visites virtuelles 360, estimation en ligne et integration CRM pour la gestion des prospects.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop"
    ],
    tags: ["Three.js", "Maps API", "React"],
    metrics: "+400% visites",
    results: [
      "400% d'augmentation des visites qualifiees",
      "Visites virtuelles utilisees par 80% des prospects",
      "Temps moyen sur site: 8 minutes",
      "30% de conversion prospects/visites"
    ],
    year: "2023",
    duration: "10 semaines"
  },
  {
    id: "medical-center",
    title: "Centre Medical Atlas",
    client: "Clinique Atlas Casablanca",
    category: "Application Web",
    description: "Systeme de teleconsultation securise avec gestion des dossiers patients et ordonnances.",
    fullDescription: "La Clinique Atlas est un centre medical multidisciplinaire. Nous avons developpe une plateforme de teleconsultation complete, conforme aux reglementations sanitaires, avec gestion des dossiers medicaux, ordonnances electroniques et prise de rendez-vous.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&h=500&fit=crop"
    ],
    tags: ["Securite", "WebRTC", "HIPAA"],
    metrics: "5000+ consultations",
    results: [
      "5000+ teleconsultations realisees",
      "Note satisfaction patients: 4.8/5",
      "Reduction de 50% des rendez-vous manques",
      "Conformite totale aux normes de sante"
    ],
    testimonial: {
      text: "La plateforme a revolutionne notre pratique. Nos patients apprecient la flexibilite des teleconsultations.",
      author: "Dr. Leila Bennani",
      role: "Directrice medicale"
    },
    year: "2024",
    duration: "12 semaines"
  },
]

const categories = ["Tous", "Site Vitrine", "E-Commerce", "Application Web"]

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !project) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image carousel */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <img
            src={project.images[currentImageIndex]}
            alt={project.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {project.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      idx === currentImageIndex ? "bg-primary w-6" : "bg-foreground/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
              {project.metrics}
            </span>
            <span className="px-3 py-1 glass text-xs font-medium rounded-full">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
            <p className="text-primary font-medium">{project.client}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {project.year}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              Duree: {project.duration}
            </div>
            {project.link && (
              <a href={project.link} className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Globe className="w-4 h-4" />
                Voir le site
              </a>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs px-3 py-1 bg-secondary rounded-full text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {project.fullDescription}
          </p>

          {/* Results */}
          <div className="glass rounded-xl p-6 mb-8">
            <h4 className="font-semibold mb-4">Resultats obtenus</h4>
            <ul className="grid sm:grid-cols-2 gap-3">
              {project.results.map((result, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="glass rounded-xl p-6 mb-8 border-l-4 border-primary">
              <p className="italic text-muted-foreground mb-4">"{project.testimonial.text}"</p>
              <div>
                <p className="font-semibold">{project.testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{project.testimonial.role}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/devis" className="flex-1">
              <Button className="w-full glow" size="lg">
                Lancer un projet similaire
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/#contact" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Tous")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAll, setShowAll] = useState(false)

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

  const filteredProjects = activeCategory === "Tous" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-balance">
            Nos{' '}
            <span className="gradient-text">realisations</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Decouvrez quelques-uns des projets qui ont transforme la presence digitale de nos clients marocains.
          </p>
        </div>

        {/* Category filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category)
                setShowAll(false)
              }}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "group glass rounded-2xl overflow-hidden card-3d transition-all duration-500 cursor-pointer",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              )}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Metrics badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
                  {project.metrics}
                </div>

                {/* Category badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1 glass text-xs font-medium rounded-full">
                  {project.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-primary mb-2">{project.client}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <button className="flex items-center gap-2 text-primary text-sm font-medium group/link">
                  Voir les details
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* See all CTA */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {!showAll && filteredProjects.length > 6 && (
            <Button 
              size="lg" 
              className="group glow"
              onClick={() => setShowAll(true)}
            >
              Voir tous nos projets ({filteredProjects.length})
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
          {showAll && (
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowAll(false)}
            >
              Afficher moins
            </Button>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  )
}
