"use client"

import { useState } from 'react'
import { 
  X, 
  Check, 
  CreditCard, 
  Loader2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPack?: {
    name: string
    price: string
    features: string[]
  }
}

const steps = [
  { id: 1, name: 'Informations' },
  { id: 2, name: 'Résumé' },
  { id: 3, name: 'Paiement' },
]

export function OrderModal({ isOpen, onClose, selectedPack }: OrderModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    notes: ''
  })

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setCurrentStep(3)
  }

  const handlePayment = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Payment success
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Commander {selectedPack?.name || 'Pack'}</h2>
            <p className="text-sm text-muted-foreground">Étape {currentStep} sur 3</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                  currentStep >= step.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-muted-foreground"
                )}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={cn(
                  "ml-3 text-sm font-medium hidden sm:block",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 md:w-24 h-0.5 mx-4",
                    currentStep > step.id ? "bg-primary" : "bg-secondary"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="jean@entreprise.fr"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Entreprise</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="Ma Super Entreprise"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                  placeholder="123 Rue de l'Exemple"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="75001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pays</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                    placeholder="France"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes additionnelles</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all resize-none"
                  placeholder="Informations supplémentaires..."
                />
              </div>

              <Button 
                onClick={() => setCurrentStep(2)} 
                className="w-full glow"
                disabled={!formData.name || !formData.email}
              >
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2: Summary */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-secondary/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Récapitulatif de la commande</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pack sélectionné</span>
                    <span className="font-medium">{selectedPack?.name || 'Business'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix</span>
                    <span className="font-medium">{selectedPack?.price || '2490'}€</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC</span>
                    <span className="gradient-text">{selectedPack?.price || '2490'}€</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Informations de facturation</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nom</span>
                    <p className="font-medium">{formData.name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="font-medium">{formData.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Téléphone</span>
                    <p className="font-medium">{formData.phone || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Entreprise</span>
                    <p className="font-medium">{formData.company || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    'Procéder au paiement'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Paiement sécurisé</h3>
                <p className="text-muted-foreground">
                  Vous allez être redirigé vers notre page de paiement sécurisé.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center justify-center gap-6 opacity-60">
                  <span className="text-sm">Visa</span>
                  <span className="text-sm">Mastercard</span>
                  <span className="text-sm">PayPal</span>
                  <span className="text-sm">Apple Pay</span>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                className="w-full glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payer {selectedPack?.price || '2490'}€
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
