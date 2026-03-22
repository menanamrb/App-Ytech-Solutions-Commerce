"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, Star, X, Clock, Users, Zap, Shield, Headphones, Code, Palette, Database, Globe, LogIn, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BankFormModal from './bank-form-modal'

interface Package {
  id: string
  name: string
  subtitle: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  badge: string | null
  detailedFeatures: {
    category: string
    icon: React.ElementType
    items: string[]
  }[]
  deliveryTime: string
  revisions: string
  support: string
}

interface PackOrderModalProps {
  pkg: Package | null
  isOpen: boolean
  onClose: () => void
  onOrder: (pkg: Package) => void
}

export default function PackOrderModal({ pkg, isOpen, onClose, onOrder }: PackOrderModalProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    prenom: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    acceptTerms: false
    // Supprimé: projectDescription
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBankForm, setShowBankForm] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Mettre à jour le formulaire quand la session change
  useEffect(() => {
    if (session?.user) {
      // Récupérer directement le prénom et nom depuis la session (comme dans l'inscription)
      const prenom = session.user.firstName || ""
      const name = session.user.lastName || ""
      
      // Toujours pré-remplir avec les données de session
      setFormData(prev => ({
        ...prev,
        prenom: prenom,
        name: name,
        email: session.user?.email || ""
      }))
    }
  }, [session])

  if (!isOpen || !pkg) return null

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const orderData = {
        pack_id: pkg.id === "starter" ? 1 : pkg.id === "business" ? 2 : pkg.id === "ecommerce" ? 3 : pkg.id === "enterprise" ? 4 : 1,
        pack_name: pkg.name,
        pack_price: pkg.price.replace(/\s/g, ''),
        pack_features: pkg.features,
        client_name: `${formData.prenom} ${formData.name}`,
        client_email: formData.email,
        client_phone: formData.phone || "",
        client_company: formData.company || "",
        client_city: formData.city || "",
        project_description: ""
      }
      
      // Envoyer à l'API des commandes de packs
      const response = await fetch('/api/pack-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setShowBankForm(true)
      } else {
        if (result.error?.includes('existe déjà')) {
          alert('Une commande pour ce pack existe déjà pour cet email. Veuillez vérifier vos commandes en cours.')
        } else {
          throw new Error(result.error || 'Erreur lors de la commande')
        }
      }
    } catch (error) {
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoginRedirect = () => {
    setIsRedirecting(true)
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
    router.push(`/connexion?callbackUrl=${returnUrl}`)
  }

  const handlePaymentSuccess = () => {
    // Callback après succès du paiement
    console.log('Paiement réussi pour le pack:', pkg?.name)
    console.log('Détails du pack:', pkg)
  }

  // Si l'utilisateur n'est pas connecté, afficher un message de connexion requise
  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="relative glass rounded-2xl w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Vérification de la connexion...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative glass rounded-2xl w-full max-w-md p-8 text-center animate-slide-up">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour commander un pack. Veuillez vous connecter ou créer un compte.
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              onClick={handleLoginRedirect}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirection...
                </>
              ) : (
                <>
                  Se connecter
                  <LogIn className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
              disabled={isRedirecting}
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors lg:block md:block"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between mb-6 lg:mb-8">
            <div className="mb-4 lg:mb-0">
              {pkg.badge && (
                <span className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-primary text-primary-foreground text-xs lg:text-sm font-semibold rounded-full mb-3 lg:mb-4">
                  {pkg.highlighted ? <Star className="w-3 h-3 lg:w-4 lg:h-4" /> : <Zap className="w-3 h-3 lg:w-4 lg:h-4" />}
                  {pkg.badge}
                </span>
              )}
              <h2 className="text-2xl lg:text-4xl font-bold">{pkg.name}</h2>
              <p className="text-sm lg:text-lg text-muted-foreground">{pkg.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl lg:text-5xl font-bold gradient-text">{pkg.price}</div>
              {pkg.period && <div className="text-xs lg:text-sm text-muted-foreground">DHS - Paiement {pkg.period}</div>}
            </div>
          </div>

          <p className="text-sm lg:text-lg text-muted-foreground mb-4 lg:mb-8 text-center leading-relaxed">
            {pkg.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6 mb-4 lg:mb-8">
            <div className="glass rounded-xl lg:rounded-2xl p-3 lg:p-6 text-center">
              <Clock className="w-4 h-4 lg:w-6 lg:h-6 text-primary mx-auto mb-2 lg:mb-3" />
              <div className="text-xs lg:text-lg font-medium">{pkg.deliveryTime}</div>
              <div className="text-xs text-muted-foreground">Delai</div>
            </div>
            <div className="glass rounded-xl lg:rounded-2xl p-3 lg:p-6 text-center">
              <Zap className="w-4 h-4 lg:w-6 lg:h-6 text-primary mx-auto mb-2 lg:mb-3" />
              <div className="text-xs lg:text-lg font-medium">{pkg.revisions}</div>
              <div className="text-xs text-muted-foreground">Revisions</div>
            </div>
            <div className="glass rounded-xl lg:rounded-2xl p-3 lg:p-6 text-center">
              <Headphones className="w-4 h-4 lg:w-6 lg:h-6 text-primary mx-auto mb-2 lg:mb-3" />
              <div className="text-xs lg:text-lg font-medium">{pkg.support}</div>
              <div className="text-xs text-muted-foreground">Support</div>
            </div>
          </div>

          
          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-4 lg:mb-8">
            <div className="space-y-3 lg:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div>
                  <label className="text-xs lg:text-sm font-medium">Prénom *</label>
                  <input
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border rounded-lg bg-secondary/50 text-sm lg:text-base"
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    placeholder="Jean"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs lg:text-sm font-medium">Nom *</label>
                  <input
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-border rounded-lg bg-secondary/50 text-sm lg:text-base"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs lg:text-sm font-medium">Email *</label>
                <div className="relative">
                  <input
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 border border-border rounded-lg bg-secondary/50 text-sm lg:text-base"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    placeholder="jean.dupont@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs lg:text-sm font-medium">Téléphone</label>
                <div className="relative">
                  <input
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 border border-border rounded-lg bg-secondary/50 text-sm lg:text-base"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+212 6 12 34 56"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs lg:text-sm font-medium">Entreprise</label>
                <div className="relative">
                  <input
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 border border-border rounded-lg bg-secondary/50 text-sm lg:text-base"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Entreprise SAS"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs lg:text-sm font-medium">Ville</label>
                <div className="relative">
                  <input
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 border border-border rounded-lg bg-secondary/50 text-sm lg:text-base"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Casablanca"
                  />
                </div>
              </div>
            </div>

            {/* Pack Info */}
            <div className="space-y-3 lg:space-y-6">
              <div className="glass rounded-xl lg:rounded-2xl p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Récapitulatif de votre commande</h3>
                <div className="space-y-2 lg:space-y-3 text-sm lg:text-lg">
                  <p><strong>Pack :</strong> {pkg.name}</p>
                  <p><strong>Prix :</strong> {pkg.price} DHS</p>
                  <p><strong>Fonctionnalités :</strong> {pkg.features.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Form Modal */}
          <BankFormModal 
            pkg={pkg}
            isOpen={showBankForm}
            onClose={() => setShowBankForm(false)}
            onSuccess={handlePaymentSuccess}
          />

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Button 
              variant="outline" 
              className="flex-1 text-sm lg:text-base py-2 lg:py-4"
              onClick={onClose}
              disabled={isSubmitting || showBankForm}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm lg:text-base py-2 lg:py-4"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || showBankForm}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Payer maintenant'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
