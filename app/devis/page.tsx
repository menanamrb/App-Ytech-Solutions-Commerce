"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  ShoppingCart,
  Wrench,
  Server,
  Palette,
  Search,
  Smartphone,
  Shield,
  Zap,
  FileText,
  Send,
  Calendar,
  Building2,
  Mail,
  Phone,
  User,
  MessageSquare,
  Loader2,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const services = [
  { id: "starter", name: "Site Vitrine Starter", icon: Globe, price: "9 900 DHS" },
  { id: "business", name: "Site Vitrine Business", icon: Globe, price: "24 900 DHS" },
  { id: "ecommerce", name: "E-Commerce", icon: ShoppingCart, price: "49 900 DHS" },
  { id: "enterprise", name: "Solution Enterprise", icon: Server, price: "Sur devis" },
  { id: "maintenance-essentiel", name: "Maintenance Essentiel", icon: Wrench, price: "490 DHS/mois" },
  { id: "maintenance-avance", name: "Maintenance Avance", icon: Wrench, price: "990 DHS/mois" },
  { id: "maintenance-premium", name: "Maintenance Premium", icon: Wrench, price: "1 990 DHS/mois" },
]

const features = [
  { id: "design", name: "Design personnalise", icon: Palette },
  { id: "seo", name: "Optimisation SEO", icon: Search },
  { id: "responsive", name: "Responsive mobile", icon: Smartphone },
  { id: "security", name: "Securite renforcee", icon: Shield },
  { id: "performance", name: "Performance optimisee", icon: Zap },
  { id: "cms", name: "CMS integre", icon: FileText },
  { id: "multilingual", name: "Multilingue", icon: Globe },
  { id: "analytics", name: "Analytics avance", icon: Search },
]

const budgets = [
  { id: "small", label: "Moins de 10 000 DHS", value: "0-10000" },
  { id: "medium", label: "10 000 - 30 000 DHS", value: "10000-30000" },
  { id: "large", label: "30 000 - 50 000 DHS", value: "30000-50000" },
  { id: "xlarge", label: "50 000 - 100 000 DHS", value: "50000-100000" },
  { id: "enterprise", label: "Plus de 100 000 DHS", value: "100000+" },
]

const timelines = [
  { id: "urgent", label: "Urgent (< 2 semaines)", value: "urgent" },
  { id: "normal", label: "Normal (2-4 semaines)", value: "normal" },
  { id: "relaxed", label: "Flexible (1-2 mois)", value: "relaxed" },
  { id: "planning", label: "En planification", value: "planning" },
]

export default function DevisPage() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    selectedServices: [] as string[],
    selectedFeatures: [] as string[],
    budget: "",
    timeline: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    projectDescription: "",
    acceptTerms: false
  })

  // Pre-select pack from URL params
  useEffect(() => {
    const pack = searchParams.get('pack')
    const maintenance = searchParams.get('maintenance')
    
    if (pack) {
      setFormData(prev => ({
        ...prev,
        selectedServices: [pack]
      }))
    }
    if (maintenance) {
      setFormData(prev => ({
        ...prev,
        selectedServices: [`maintenance-${maintenance}`]
      }))
    }
  }, [searchParams])

  const totalSteps = 4

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(id => id !== featureId)
        : [...prev.selectedFeatures, featureId]
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.selectedServices.length > 0
      case 2:
        return formData.budget && formData.timeline
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 4:
        return formData.projectDescription && formData.acceptTerms
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Générer une référence unique
      const reference = `DEV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      
      // Préparer les données pour l'API
      const servicesNames = formData.selectedServices.map(id => 
        services.find(s => s.id === id)?.name || 'Service inconnu'
      )
      
      const featuresNames = formData.selectedFeatures.map(id => 
        features.find(f => f.id === id)?.name || 'Fonctionnalité inconnue'
      )
      
      // Calculer le montant (approximation basée sur les prix)
      const amount = formData.selectedServices.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId)
        if (service?.price.includes('DHS')) {
          const price = parseInt(service.price.replace(/[^0-9]/g, ''))
          return total + price
        }
        return total
      }, 0)
      
      const devisData = {
        reference,
        client_name: `${formData.firstName} ${formData.lastName}`,
        client_email: formData.email,
        service: servicesNames.join(', '),
        features: featuresNames,
        amount: amount || 0,
        project_description: formData.projectDescription,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 jours
      }
      
      // Envoyer à l'API
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
      } else {
        throw new Error(result.error || 'Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (canProceed() && step < totalSteps) {
      setStep(step + 1)
    } else if (step === totalSteps && canProceed()) {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-slide-up">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Demande envoyee !</h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre demande de devis. Notre equipe vous contactera 
            dans les 24 heures ouvrees.
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour a l&apos;accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">Y</span>
            </div>
            <span className="text-xl font-bold">Ytech Solutions</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Demander un devis gratuit</h1>
            <span className="text-sm text-muted-foreground">
              Etape {step} sur {totalSteps}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {["Services", "Budget", "Contact", "Projet"].map((label, index) => (
              <span 
                key={label}
                className={cn(
                  "text-xs transition-colors",
                  index + 1 <= step ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Services Selection */}
        {step === 1 && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <h2 className="text-xl font-semibold mb-2">Quels services vous interessent ?</h2>
              <p className="text-muted-foreground">Selectionnez un ou plusieurs services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02]",
                    formData.selectedServices.includes(service.id)
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                        formData.selectedServices.includes(service.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      )}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-primary font-medium">{service.price}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      formData.selectedServices.includes(service.id)
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}>
                      {formData.selectedServices.includes(service.id) && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-4">Fonctionnalites souhaitees (optionnel)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => toggleFeature(feature.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left flex items-center gap-3 transition-all",
                      formData.selectedFeatures.includes(feature.id)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <feature.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{feature.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Timeline */}
        {step === 2 && (
          <div className="space-y-8 animate-slide-up">
            <div>
              <h2 className="text-xl font-semibold mb-2">Budget et delais</h2>
              <p className="text-muted-foreground">Aidez-nous a mieux cerner votre projet</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">DH</span>
                </div>
                <h3 className="font-semibold">Quel est votre budget ?</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {budgets.map((budget) => (
                  <button
                    key={budget.id}
                    onClick={() => setFormData({ ...formData, budget: budget.value })}
                    className={cn(
                      "p-4 rounded-lg border text-center transition-all hover:scale-[1.02]",
                      formData.budget === budget.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold">Quand souhaitez-vous demarrer ?</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {timelines.map((timeline) => (
                  <button
                    key={timeline.id}
                    onClick={() => setFormData({ ...formData, timeline: timeline.value })}
                    className={cn(
                      "p-4 rounded-lg border text-center transition-all hover:scale-[1.02]",
                      formData.timeline === timeline.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    {timeline.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-semibold mb-2">Vos coordonnees</h2>
              <p className="text-muted-foreground">Comment pouvons-nous vous contacter ?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prenom *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Mohammed"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom *</label>
                <input
                  type="text"
                  placeholder="Alami"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="mohammed@entreprise.ma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Telephone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <input
                  type="text"
                  placeholder="Casablanca"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entreprise</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Mon Entreprise SARL"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Project Details */}
        {step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-semibold mb-2">Details du projet</h2>
              <p className="text-muted-foreground">Parlez-nous de votre projet</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Description du projet *
              </label>
              <textarea
                placeholder="Decrivez votre projet en quelques lignes : objectifs, fonctionnalites souhaitees, public cible..."
                className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none min-h-32"
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              />
            </div>


            {/* Summary */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">Recapitulatif de votre demande</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-medium text-right">
                    {formData.selectedServices.map(id => 
                      services.find(s => s.id === id)?.name
                    ).join(", ") || "-"}
                  </span>
                </div>
                {formData.selectedFeatures.length > 0 && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Fonctionnalites</span>
                    <span className="font-medium text-right">
                      {formData.selectedFeatures.map(id => 
                        features.find(f => f.id === id)?.name
                      ).join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">
                    {budgets.find(b => b.value === formData.budget)?.label || "-"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Delai</span>
                  <span className="font-medium">
                    {timelines.find(t => t.value === formData.timeline)?.label || "-"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                  formData.acceptTerms
                    ? "bg-primary border-primary"
                    : "border-border"
                )}
              >
                {formData.acceptTerms && <Check className="w-3 h-3 text-primary-foreground" />}
              </button>
              <label className="text-sm text-muted-foreground">
                J&apos;accepte les{" "}
                <a href="#" className="text-primary hover:underline">conditions generales</a>
                {" "}et la{" "}
                <a href="#" className="text-primary hover:underline">politique de confidentialite</a>
                . *
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Precedent
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceed() || isSubmitting}
            className="gap-2 glow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : step === totalSteps ? (
              <>
                <Send className="w-4 h-4" />
                Envoyer ma demande
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
