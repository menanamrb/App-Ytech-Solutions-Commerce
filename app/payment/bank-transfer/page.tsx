"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight, X, Copy, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BankTransferPage() {
  const searchParams = useSearchParams()
  const packName = searchParams.get('pack') || 'Pack'
  const packPrice = searchParams.get('price') || '0'
  const [copied, setCopied] = useState(false)

  const bankDetails = {
    bank: 'Attijariwafa Bank',
    accountName: 'TEHCOMMERCE SARL',
    accountNumber: '007 890 123456789000 18',
    rib: '007 780 123456789000180 18',
    iban: 'MA64 0078 0000 1234 5678 9000 181',
    swift: 'ATJMMAMC'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Paiement par Virement Bancaire</h1>
          <p className="text-muted-foreground text-lg">
            Finalisez votre commande en effectuant un virement bancaire
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

        {/* Bank Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Coordonnées Bancaires</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Banque</p>
                <p className="font-semibold">{bankDetails.bank}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Nom du compte</p>
                <p className="font-semibold">{bankDetails.accountName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Numéro de compte</p>
                <p className="font-mono font-semibold">{bankDetails.accountNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.accountNumber)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">RIB</p>
                <p className="font-mono font-semibold">{bankDetails.rib}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.rib)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">IBAN</p>
                <p className="font-mono font-semibold">{bankDetails.iban}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.iban)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">SWIFT/BIC</p>
                <p className="font-mono font-semibold">{bankDetails.swift}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.swift)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-3">Instructions importantes</h3>
          <ul className="space-y-2 text-sm">
            <li>• Effectuez le virement du montant exact de {packPrice} DHS</li>
            <li>• Mentionnez votre nom et "{packName}" dans la référence du virement</li>
            <li>• Le traitement prendra 24-48h après réception du paiement</li>
            <li>• Vous recevrez une confirmation email dès validation</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button size="lg" className="w-full">
              Voir mes commandes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
