"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Paiement annulé</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>
        
        <div className="space-y-4">
          <Link href="/packs">
            <Button size="lg">
              Réessayer le paiement
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
