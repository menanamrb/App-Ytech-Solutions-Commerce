"use client"

import { useEffect, useRef, useState } from 'react'
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  Loader2,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    value: "123 Boulevard Zerktouni\nCasablanca 20000, Maroc"
  },
  {
    icon: Phone,
    title: "Telephone",
    value: "+212 5 22 XX XX XX\n+212 6 XX XX XX XX"
  },
  {
    icon: Mail,
    title: "Email",
    value: "contact@ytech-solutions.ma\ncommercial@ytech-solutions.ma"
  },
  {
    icon: Clock,
    title: "Horaires",
    value: "Lun - Ven: 9h - 18h\nSam: 9h - 13h"
  },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
]

const packOptions = [
  "Site Vitrine - Starter (9 900 DHS)",
  "Site Vitrine - Business (24 900 DHS)",
  "E-Commerce (49 900 DHS)",
  "Enterprise / Sur mesure",
  "Maintenance Essentiel (490 DHS/mois)",
  "Maintenance Avance (990 DHS/mois)",
  "Maintenance Premium (1 990 DHS/mois)",
  "Autre demande"
]

const budgetOptions = [
  "Moins de 10 000 DHS",
  "10 000 - 30 000 DHS",
  "30 000 - 50 000 DHS",
  "50 000 - 100 000 DHS",
  "Plus de 100 000 DHS"
]

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    pack: '',
    budget: '',
    message: ''
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message')
      }
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          pack: '',
          budget: '',
          message: ''
        })
      }, 3000)
    } catch (error) {
      setIsSubmitting(false)
      console.error('Erreur:', error)
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 text-balance">
            Demarrons votre{' '}
            <span className="gradient-text">projet</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Pret a transformer votre presence digitale ? Contactez-nous pour un devis gratuit et personnalise.
          </p>
        </div>

        {/* Horizontal layout */}
        <div className="space-y-12">
          {/* Coordonnees Section */}
          <div className={`transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h3 className="text-2xl font-bold mb-6 text-center">Nos coordonnees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="glass rounded-xl p-6 text-center card-3d"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{info.title}</h4>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Contactez-nous</h3>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message envoye !</h3>
                  <p className="text-muted-foreground">
                    Nous vous recontacterons dans les 24 heures.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Mohammed Alami"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="mohammed@entreprise.ma"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Telephone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="+212 6 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="Mon Entreprise SARL"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pack souhaite
                      </label>
                      <select
                        name="pack"
                        value={formData.pack}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      >
                        <option value="">Selectionnez un pack</option>
                        {packOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Budget estime
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      >
                        <option value="">Selectionnez un budget</option>
                        {budgetOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Decrivez votre projet *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      placeholder="Parlez-nous de votre projet, vos objectifs, vos delais..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full glow group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer ma demande
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    En soumettant ce formulaire, vous acceptez notre{' '}
                    <a href="#" className="text-primary hover:underline">
                      politique de confidentialite
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
