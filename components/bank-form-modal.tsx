"use client"

import { useState } from 'react'
import { Check, ArrowRight, CreditCard, Calendar, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardIcon } from '@/components/ui/card-icons'

interface BankFormModalProps {
  pkg: any
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BankFormModal({ pkg, isOpen, onClose }: BankFormModalProps) {
  if (!isOpen || !pkg) return null

  console.log('BankFormModal - pkg reçu:', pkg)
  console.log('BankFormModal - isOpen:', isOpen)
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    acceptTerms: false
  })
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | null>(null)
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Détecter le type de carte
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    if (cleaned.startsWith('4')) {
      setCardType('visa')
      console.log('Carte Visa détectée')
    }
    else if (cleaned.startsWith('5') || cleaned.startsWith('2')) {
      setCardType('mastercard')
      console.log('Carte Mastercard détectée')
    }
    else if (cleaned.startsWith('3')) {
      setCardType('amex')
      console.log('Carte AMEX détectée')
    }
    else {
      setCardType(null)
      console.log('Type de carte non détecté')
    }
  }

  // Formater le numéro de carte
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim()
    return formatted
  }

  // Formater la date d'expiration
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  // Valider la date d'expiration
  const isExpiryDateValid = (expiry: string) => {
    if (!expiry || !expiry.includes('/')) return false
    
    const [month, year] = expiry.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
    
    const expYear = parseInt(year)
    const expMonth = parseInt(month)
    
    if (expYear < currentYear) return false
    if (expYear === currentYear && expMonth < currentMonth) return false
    if (expMonth < 1 || expMonth > 12) return false
    
    return true
  }

  // Générer les mois et années pour le sélecteur
  const months = [
    '01', '02', '03', '04', '05', '06', 
    '07', '08', '09', '10', '11', '12'
  ]
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString().slice(-2))

  const selectMonthYear = (month: string, year: string) => {
    setFormData(prev => ({ ...prev, expiryDate: `${month}/${year}` }))
    setShowMonthYearPicker(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simuler le traitement du paiement
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      
      // Fermer après 3 secondes
      setTimeout(() => {
        setShowSuccess(false)
        onSuccess()
        onClose()
      }, 3000)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Paiement Sécurisé</h2>
            <p className="text-muted-foreground">
              Finalisez votre commande du pack {pkg?.name || 'Pack'}
            </p>
          </div>

          {/* Récapitulatif */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Récapitulatif de la commande</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom du pack :</span>
                <span className="font-semibold">{pkg?.name || 'Pack Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prix :</span>
                <span className="font-bold text-xl text-blue-600">{pkg?.price || '0'} DHS</span>
              </div>
            </div>
          </div>

          {/* Formulaire de paiement */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Numéro de carte */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Numéro de carte</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value)
                      setFormData(prev => ({ ...prev, cardNumber: formatted }))
                      // Forcer la détection après chaque changement
                      setTimeout(() => detectCardType(e.target.value), 100)
                    }}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/50 pr-24"
                    maxLength={19}
                    required
                  />
                  <CreditCard className="absolute right-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  {cardType && (
                    <div className="absolute right-14 top-3.5 flex items-center justify-center">
                      <CardIcon type={cardType} className="scale-100" />
                    </div>
                  )}
                </div>
              </div>

              {/* Nom du titulaire */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Nom du titulaire</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.cardName}
                  onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/50"
                  required
                />
              </div>

              {/* Date d'expiration */}
              <div>
                <label className="block text-sm font-medium mb-2">Date d'expiration</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value)
                      setFormData(prev => ({ ...prev, expiryDate: formatted }))
                    }}
                    onFocus={() => setShowMonthYearPicker(true)}
                    className={`w-full px-4 py-3 border rounded-lg bg-secondary/50 pr-12 cursor-pointer ${
                      formData.expiryDate && !isExpiryDateValid(formData.expiryDate) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-border'
                    }`}
                    maxLength={5}
                    required
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                    className="absolute right-3 top-3.5 flex items-center justify-center p-1 hover:bg-gray-100 rounded"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </button>
                  
                  {/* Sélecteur Mois/Année */}
                  {showMonthYearPicker && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4">
                      <div className="mb-4">
                        <label className="text-sm font-semibold text-gray-800 mb-3 block">Mois</label>
                        <div className="grid grid-cols-4 gap-2">
                          {months.map((month) => (
                            <button
                              key={month}
                              type="button"
                              onClick={() => {
                                const year = formData.expiryDate.split('/')[1] || years[0]
                                selectMonthYear(month, year)
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                formData.expiryDate.startsWith(month) 
                                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                              }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-3 block">Année</label>
                        <div className="grid grid-cols-5 gap-2">
                          {years.map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => {
                                const month = formData.expiryDate.split('/')[0] || months[0]
                                selectMonthYear(month, year)
                              }}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                formData.expiryDate.endsWith(year) 
                                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.expiryDate && !isExpiryDateValid(formData.expiryDate) && (
                    <p className="text-xs text-red-500 mt-1">La date doit être dans le futur</p>
                  )}
                  {formData.expiryDate && isExpiryDateValid(formData.expiryDate) && (
                    <p className="text-xs text-green-500 mt-1">Date valide</p>
                  )}
                </div>
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-secondary/50"
                  maxLength={3}
                  required
                />
              </div>
            </div>

            {/* Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                className="mt-1 mr-3"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                J'accepte les conditions générales de vente et confirme que les informations fournies sont exactes. 
                Le paiement sera traité de manière sécurisée.
              </label>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                disabled={isSubmitting || !formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv || !formData.acceptTerms || !isExpiryDateValid(formData.expiryDate)}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Traitement en cours...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Payer {pkg?.price} DHS
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Sécurité */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Paiement sécurisé
          </div>
        </div>
      </div>

      {/* Popup de succès */}
      {showSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
          <div className="relative glass rounded-2xl p-8 max-w-md w-full animate-slide-up">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Paiement réussi !</h3>
              <p className="text-muted-foreground mb-6">
                Félicitations ! Votre paiement de {pkg?.price || '0'} DHS pour le pack {pkg?.name || 'Pack'} a été traité avec succès.
              </p>
              <div className="text-sm text-green-600 font-medium mb-4">
                Un email de confirmation vous sera envoyé dans quelques instants.
              </div>
              <div className="text-sm text-muted-foreground">
                Redirection automatique...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
