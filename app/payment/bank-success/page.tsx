"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BankTransferSuccessPage() {
  const searchParams = useSearchParams()
  const packName = searchParams.get('pack') || 'Pack'
  const [showPopup, setShowPopup] = useState(true)

  useEffect(() => {
    // Simuler la vérification du paiement
    const timer = setTimeout(() => {
      setShowPopup(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Popup de succès */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClosePopup} />
          <div className="relative glass rounded-2xl p-8 max-w-md w-full animate-slide-up">
            <button 
              onClick={handleClosePopup}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Instructions envoyées !</h2>
              <p className="text-muted-foreground mb-6">
                Les instructions de virement bancaire ont été envoyées à votre email. 
                Votre commande sera validée dès réception du paiement (24-48h).
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
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu de la page */}
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Virement bancaire initié</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Votre commande du pack <span className="font-semibold">{packName}</span> a été enregistrée. 
          Veuillez effectuer le virement pour finaliser votre commande.
        </p>
        
        {/* Instructions récapitulatives */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
          <h3 className="text-xl font-semibold mb-4">Prochaines étapes</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium">Consultez votre email</p>
                <p className="text-sm text-muted-foreground">Vous avez reçu les coordonnées bancaires complètes</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium">Effectuez le virement</p>
                <p className="text-sm text-muted-foreground">Utilisez les coordonnées fournies et mentionnez la référence</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium">Validation du paiement</p>
                <p className="text-sm text-muted-foreground">Nous validons votre commande dans 24-48h après réception</p>
              </div>
            </div>
          </div>
        </div>
        
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
