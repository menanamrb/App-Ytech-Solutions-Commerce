"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Building2,
  Phone,
  ArrowRight,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function InscriptionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptNewsletter: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }
    
    setIsLoading(true)
    
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to dashboard
    router.push("/dashboard")
  }

  const passwordStrength = () => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strengthColors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-primary"]
  const strengthLabels = ["Faible", "Moyen", "Bon", "Excellent"]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12">
          <Link href="/" className="mb-12">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">Y</span>
              </div>
              <span className="text-2xl font-bold">Ytech Solutions</span>
            </motion.div>
          </Link>

          <motion.h1 
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">Rejoignez</span> plus de
            <br />500 entreprises
          </motion.h1>

          <motion.p 
            className="text-muted-foreground text-lg mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Creez votre compte gratuit et decouvrez comment nous pouvons 
            transformer votre presence digitale.
          </motion.p>

          {/* Benefits */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              "Devis gratuit en 24h",
              "Accompagnement personnalise",
              "Support technique reactif",
              "Tarifs transparents"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">Y</span>
            </div>
            <span className="text-xl font-bold">Ytech Solutions</span>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm hidden sm:inline">Informations</span>
            </div>
            <div className="w-12 h-0.5 bg-border">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: step >= 2 ? "100%" : "0%" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                2
              </div>
              <span className="text-sm hidden sm:inline">Securite</span>
            </div>
          </div>

          <div className="text-center mb-8 lg:text-left">
            <h2 className="text-3xl font-bold mb-2">
              {step === 1 ? "Creer un compte" : "Securisez votre compte"}
            </h2>
            <p className="text-muted-foreground">
              Deja inscrit ?{" "}
              <Link href="/connexion" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prenom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Jean"
                        className="pl-10 h-12 bg-secondary/50 border-border"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <Input
                      type="text"
                      placeholder="Dupont"
                      className="h-12 bg-secondary/50 border-border"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 h-12 bg-secondary/50 border-border"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Telephone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      className="pl-10 h-12 bg-secondary/50 border-border"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Entreprise (optionnel)</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nom de votre entreprise"
                      className="pl-10 h-12 bg-secondary/50 border-border"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 caracteres"
                      className="pl-10 pr-10 h-12 bg-secondary/50 border-border"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i < passwordStrength() 
                                ? strengthColors[passwordStrength() - 1] 
                                : "bg-secondary"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Force: {strengthLabels[passwordStrength() - 1] || "Tres faible"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Retapez votre mot de passe"
                      className="pl-10 h-12 bg-secondary/50 border-border"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, acceptTerms: checked as boolean })
                      }
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-tight">
                      J&apos;accepte les{" "}
                      <Link href="/conditions" className="text-primary hover:underline">
                        conditions d&apos;utilisation
                      </Link>{" "}
                      et la{" "}
                      <Link href="/confidentialite" className="text-primary hover:underline">
                        politique de confidentialite
                      </Link>
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="newsletter"
                      checked={formData.acceptNewsletter}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, acceptNewsletter: checked as boolean })
                      }
                    />
                    <label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer leading-tight">
                      Je souhaite recevoir les actualites et offres speciales
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-2">
              {step === 2 && (
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
              )}
              <Button 
                type="submit" 
                className="flex-1 h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold"
                disabled={isLoading || (step === 2 && (!formData.acceptTerms || formData.password !== formData.confirmPassword))}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    {step === 1 ? "Continuer" : "Creer mon compte"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
