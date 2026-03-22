"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  User,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function ConnexionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [registerData, setRegisterData] = useState({
    prenom: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { toast } = useToast()

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0
    
    let strength = 0
    
    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    
    // Complexity checks
    if (/[a-z]/.test(password)) strength += 1 // lowercase
    if (/[A-Z]/.test(password)) strength += 1 // uppercase
    if (/[0-9]/.test(password)) strength += 1 // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1 // special chars
    
    return Math.min(strength, 5)
  }

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(registerData.password))
  }, [registerData.password])

  // Clear form data on mount to prevent browser autofill
  useEffect(() => {
    // Optimisation : retarder le clear pour ne pas bloquer le rendu initial
    const timer = setTimeout(() => {
      setLoginData({
        email: "",
        password: "",
        rememberMe: false
      })
      setRegisterData({
        prenom: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle OAuth errors
  useEffect(() => {
    // Optimisation : vérifier les erreurs de manière asynchrone
    const timer = setTimeout(() => {
      const error = searchParams.get('error')
      if (error) {
        let errorMessage = "Erreur de connexion"
        if (error === 'OAuthSignin') {
          errorMessage = "Erreur lors de la connexion avec Google. Veuillez réessayer."
        }
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive"
        })
        // Clean URL
        router.replace('/connexion')
      }
    }, 50)
    
    return () => clearTimeout(timer)
  }, [searchParams, router, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      })
      return
    }

    // Password validation
    if (loginData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false
      })

      if (result?.error) {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !"
        })
        
        // Récupérer les informations de l'utilisateur pour déterminer la redirection
        const session = await fetch('/api/auth/session').then(res => res.json())
        
        // Rediriger vers le dashboard si admin, sinon vers l'URL de retour ou par défaut
        if (session?.user?.role === 'admin') {
          router.push('/dashboard')
        } else {
          router.push(decodeURIComponent(callbackUrl))
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Name validation
    if (registerData.name.length < 2) {
      toast({
        title: "Erreur",
        description: "Le nom doit contenir au moins 2 caractères",
        variant: "destructive"
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      })
      return
    }

    // Password validation
    if (registerData.password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      })
      return
    }

    if (!acceptedTerms) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions générales d'utilisation",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prenom: registerData.prenom,
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Inscription réussie",
          description: "Vous pouvez maintenant vous connecter"
        })
        setLoginData({ email: registerData.email, password: '', rememberMe: false })
        setRegisterData({ prenom: '', name: '', email: '', password: '', confirmPassword: '' })
        // Passer à l'onglet de connexion
        const loginTab = document.querySelector('[data-value="login"]') as HTMLElement
        if (loginTab) {
          loginTab.click()
        }
      } else {
        toast({
          title: "Erreur d'inscription",
          description: data.error || "Une erreur est survenue",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    signIn('google', { callbackUrl: decodeURIComponent(callbackUrl) })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        
        {/* Animated Background Elements */}
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
              transition={{ duration: 0.5 }}
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="gradient-text">Bienvenue</span> dans votre
            <br />espace client
          </motion.h1>

          <motion.p 
            className="text-muted-foreground text-lg mb-12 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Accedez a votre tableau de bord pour gerer vos projets, 
            suivre vos commandes et communiquer avec notre equipe.
          </motion.p>

          {/* Features */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { icon: Zap, text: "Accès instantané à vos projets" },
              { icon: Sparkles, text: "Support prioritaire 24/7" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground/80">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">Y</span>
            </div>
            <span className="text-xl font-bold">Ytech Solutions</span>
          </Link>

          <div className="text-center mb-8 lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Connexion / Inscription</h2>
            <p className="text-muted-foreground">
              Accédez à votre compte ou créez-en un nouveau
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Se connecter</CardTitle>
                  <CardDescription>
                    Entrez vos identifiants pour accéder à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="•••••••••"
                          className="pl-10 pr-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="remember"
                          checked={loginData.rememberMe}
                          onCheckedChange={(checked) => 
                            setLoginData({ ...loginData, rememberMe: checked as boolean })
                          }
                        />
                        <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                          Se souvenir de moi
                        </label>
                      </div>
                      <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                        Mot de passe oublié ?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          Se connecter
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background text-muted-foreground">
                        Ou continuer avec
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-border hover:bg-secondary"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Icons.google className="w-5 h-5 mr-2" />
                    )}
                    Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>S'inscrire</CardTitle>
                  <CardDescription>
                    Créez un nouveau compte pour accéder à tous nos services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-prenom">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-prenom"
                          type="text"
                          placeholder="Votre prénom"
                          className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={registerData.prenom}
                          onChange={(e) => setRegisterData({ ...registerData, prenom: e.target.value })}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Votre nom"
                          className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="•••••••••"
                          className="pl-10 pr-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="•••••••••"
                          className="pl-10 pr-10 h-12 bg-secondary/50 border-border focus:border-primary"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {registerData.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm">Force du mot de passe</Label>
                          <span className="text-xs text-muted-foreground">
                            {passwordStrength === 0 && "Très faible"}
                            {passwordStrength === 1 && "Faible"}
                            {passwordStrength === 2 && "Moyen"}
                            {passwordStrength === 3 && "Bon"}
                            {passwordStrength === 4 && "Fort"}
                            {passwordStrength === 5 && "Très fort"}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength * 20} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    {/* Terms and Conditions */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => setAcceptedTerms(checked)}
                        />
                        <Label htmlFor="terms" className="text-sm leading-none">
                          J'accepte les{' '}
                          <Link 
                            href="/conditions-generales" 
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            conditions générales d'utilisation
                          </Link>
                          {' '}et la{' '}
                          <Link 
                            href="/politique-confidentialite" 
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            politique de confidentialité
                          </Link>
                        </Label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          S'inscrire
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background text-muted-foreground">
                        Ou s'inscrire avec
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-border hover:bg-secondary"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Icons.google className="w-5 h-5 mr-2" />
                    )}
                    Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
