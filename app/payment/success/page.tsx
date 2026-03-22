"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(true)

  useEffect(() => {
    // Simuler la vérification du paiement
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      {/* Popup de succès */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClosePopup} />
          <div className="relative glass rounded-2xl p-8 max-w-md w-full animate-slide-up">
            <button 
              onClick={handleClosePopup}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
              <p className="text-muted-foreground mb-6">
                Félicitations ! Votre paiement a été traité avec succès. Nous avons bien reçu votre commande et nous vous contacterons dans les plus brefs délais pour commencer votre projet.
              </p>
              
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full">
                    Accéder à mon tableau de bord
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleClosePopup}
                >
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de la page */}
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Paiement confirmé</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Merci pour votre confiance ! Votre commande est maintenant en cours de traitement.
        </p>
        
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button size="lg">
              Voir mes commandes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <div>
            <Link href="/">
              <Button variant="outline" size="lg">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
