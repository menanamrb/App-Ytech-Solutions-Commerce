"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Menu, X, Code2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/user-dropdown'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#packs', label: 'Nos Packs' },
  { href: '#portfolio', label: 'Réalisations' },
  { href: '#testimonials', label: 'Témoignages' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "glass py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" />
          </div>
          <span className="text-xl font-bold gradient-text">Ytech Solutions</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/devis">
            <Button className="glow hover:scale-105 transition-transform">
              Devis Gratuit
            </Button>
          </Link>
          
          {session ? (
            <UserDropdown />
          ) : (
            <Link href="/connexion">
              <Button 
                variant="outline" 
                className="hover:scale-105 transition-transform"
              >
                Connexion
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 right-0 glass overflow-hidden transition-all duration-300",
        isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <Link href="/devis" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full">
                Devis Gratuit
              </Button>
            </Link>
            
            {session ? (
              <div className="w-full">
                <UserDropdown />
              </div>
            ) : (
              <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
