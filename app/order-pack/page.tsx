"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Package,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  CheckCircle,
  ArrowLeft,
  LogIn,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePackOrders } from "@/hooks/use-pack-orders"

export default function OrderPackPage() {
  const searchParams = useSearchParams()
  const { createPackOrder } = usePackOrders()
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    prenom: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    projectDescription: "",
    acceptTerms: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const packId = searchParams.get('pack')
  const packName = searchParams.get('pack_name') || ""
  const packPrice = searchParams.get('pack_price') || ""
  const packFeatures = searchParams.get('pack_features') ? JSON.parse(searchParams.get('pack_features')!) : []

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

  useEffect(() => {
    if (packName) {
      setFormData(prev => ({
        ...prev,
        projectDescription: `Je souhaite commander le pack "${packName}" qui inclut : ${packFeatures.join(', ')}. Prix : ${packPrice} DHS`
      }))
    }
  }, [packName, packFeatures, packPrice])

  const handleLoginRedirect = () => {
    setIsRedirecting(true)
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
    router.push(`/connexion?callbackUrl=${returnUrl}`)
  }

  // Si l'utilisateur n'est pas connecté, afficher un message de connexion requise
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Vérification de la connexion...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <LogIn className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
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
                  onClick={() => window.location.href = '/'}
                  disabled={isRedirecting}
                >
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const orderData = {
        pack_id: parseInt(packId || "0"),
        pack_name: packName,
        pack_price: packPrice,
        pack_features: packFeatures,
        client_name: `${formData.prenom} ${formData.name}`,
        client_email: formData.email,
        client_phone: formData.phone,
        client_company: formData.company,
        client_city: formData.city,
        project_description: formData.projectDescription
      }
      
      await createPackOrder(orderData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold mb-4">Commande envoyée !</h1>
              <p className="text-muted-foreground mb-6">
                Votre commande du pack "{packName}" a bien été enregistrée. Nous vous contacterons rapidement pour la suite.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg text-left">
                  <p className="font-medium mb-2">Récapitulatif de votre commande :</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Pack :</strong> {packName}</p>
                    <p><strong>Prix :</strong> {parseFloat(packPrice).toLocaleString('fr-FR')} DHS</p>
                    <p><strong>Client :</strong> {formData.prenom} {formData.name}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  onClick={() => window.location.href = '/dashboard/pack-orders'}
                >
                  Voir mes commandes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux packs
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Pack Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {packName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                {parseFloat(packPrice).toLocaleString('fr-FR')} DHS
              </div>
              
              <div>
                <p className="font-medium mb-2">Fonctionnalités incluses :</p>
                <div className="flex flex-wrap gap-2">
                  {packFeatures.map((feature) => (
                    <span key={feature} className="px-3 py-1 bg-secondary rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Prénom *</label>
                  <Input
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                    placeholder="Jean"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nom *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    placeholder="jean.dupont@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+212 6 12 34 56"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Entreprise</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Entreprise SAS"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Casablanca"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description du projet</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    className="w-full pl-9 pr-4 py-3 border border-border rounded-lg resize-none h-24 bg-secondary/50"
                    value={formData.projectDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                    placeholder="Décrivez votre projet..."
                  />
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.prenom || !formData.name || !formData.email}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Commander ce pack'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
