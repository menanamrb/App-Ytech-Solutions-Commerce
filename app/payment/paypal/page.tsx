"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight, X, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PayPalPage() {
  const searchParams = useSearchParams()
  const packName = searchParams.get('pack') || 'Pack'
  const packPrice = searchParams.get('price') || '0'
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayPalPayment = () => {
    setIsProcessing(true)
    // Simuler la redirection PayPal
    setTimeout(() => {
      window.location.href = `/payment/success?method=paypal&pack=${encodeURIComponent(packName)}`
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Paiement Sécurisé PayPal</h1>
          <p className="text-muted-foreground text-lg">
            Payez en toute sécurité avec votre compte PayPal ou carte bancaire
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Récapitulatif de la commande</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pack :</span>
              <span className="font-semibold">{packName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Montant :</span>
              <span className="font-semibold text-2xl text-blue-600">{packPrice} DHS</span>
            </div>
          </div>
        </div>

        {/* PayPal Payment Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.419c.103-.594.64-1.03 1.24-1.03h6.947c.6 0 1.137.436 1.24 1.03l1.587 9.178a.641.641 0 0 1-.633.74h-4.606l-1.378 7.957a.641.641 0 0 1-.633.54h-3.632a.641.641 0 0 1-.633-.74l1.378-7.757z"/>
                  <path d="M20.622 21.337h-4.606l-1.378 7.957a.641.641 0 0 1-.633.54H10.37a.641.641 0 0 1-.633-.74l1.378-7.757h4.606l1.378-7.957a.641.641 0 0 1 .633-.54h3.632a.641.641 0 0 1 .633.74l-1.378 7.757z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Paiement PayPal</h3>
              <p className="text-muted-foreground mb-6">
                Vous serez redirigé vers la page sécurisée de PayPal pour finaliser votre paiement
              </p>
            </div>

            {/* PayPal Button */}
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={handlePayPalPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Redirection vers PayPal...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.419c.103-.594.64-1.03 1.24-1.03h6.947c.6 0 1.137.436 1.24 1.03l1.587 9.178a.641.641 0 0 1-.633.74h-4.606l-1.378 7.957a.641.641 0 0 1-.633.54h-3.632a.641.641 0 0 1-.633-.74l1.378-7.757z"/>
                    <path d="M20.622 21.337h-4.606l-1.378 7.957a.641.641 0 0 1-.633.54H10.37a.641.641 0 0 1-.633-.74l1.378-7.757h4.606l1.378-7.957a.641.641 0 0 1 .633-.54h3.632a.641.641 0 0 1 .633.74l-1.378 7.757z"/>
                  </svg>
                  Payer avec PayPal
                </div>
              )}
            </Button>

            {/* Alternative Payment Methods */}
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Vous pouvez aussi payer par carte bancaire via PayPal (sans compte)</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-3">Avantages du paiement PayPal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <span>Paiement sécurisé et crypté</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <span>Protection acheteur PayPal</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <span>Paiement instantané</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
              <span>Accepte les cartes internationales</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Voir mes commandes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/payment/bank-transfer" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Autre méthode de paiement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
