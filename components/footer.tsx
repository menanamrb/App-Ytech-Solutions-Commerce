"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  Code2, 
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubscribed(true)
    setEmail('')
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false)
    }, 3000)
  }

  return (
    <footer className="relative pt-32 pb-12 bg-secondary/30 w-full">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter */}
        <div className="glass rounded-3xl p-12 md:p-16 mb-20 -mt-48 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left flex-1">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Restez informé de nos{' '}
                <span className="gradient-text">actualités</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Inscrivez-vous pour recevoir nos conseils et offres exclusives.
              </p>
              {isSubscribed && (
                <div className="mt-6 flex items-center gap-3 text-green-500 bg-green-500/10 px-4 py-3 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-base font-medium">Inscription réussie !</span>
                </div>
              )}
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1 lg:max-w-md">
              <input
                type="email"
                placeholder="Restez informé de nos actualités"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-6 py-4 rounded-2xl bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg min-w-[320px] shadow-lg"
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="glow whitespace-nowrap px-8 py-4 text-lg rounded-2xl shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-3" />
                    S&apos;inscrire
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Main footer content - Full width centered layout */}
        <div className="flex flex-col items-center justify-center gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-center text-center max-w-2xl">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center glow shadow-lg group-hover:scale-110 transition-transform">
                  <Code2 className="w-7 h-7 text-primary-foreground" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-accent animate-pulse" />
              </div>
              <span className="text-2xl font-bold gradient-text">Ytech Solutions</span>
            </Link>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Votre partenaire de confiance pour la transformation digitale. 
              Nous créons des expériences web exceptionnelles pour les PME depuis 2020.
            </p>
            
            {/* Contact info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-base">
              <a href="mailto:contact@ytech-solutions.fr" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>contact@ytech-solutions.ma</span>
              </a>
              <a href="tel:+33123456789" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors group">
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>+212 678 000 0001</span>
              </a>
              <div className="flex items-center gap-4 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>Casablanca, Maroc</span>
              </div>
            </div>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-4 rounded-full glass hover:bg-secondary/80 transition-all group shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-2 transition-transform" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-10 text-center">
          <p className="text-base text-muted-foreground">
            © 2026 Ytech Solutions. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
