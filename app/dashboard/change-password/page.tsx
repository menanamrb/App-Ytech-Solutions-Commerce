"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
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
  const handleNewPasswordChange = (value: string) => {
    setPasswordData({ ...passwordData, newPassword: value })
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const validatePasswords = () => {
    const errors = []

    if (passwordData.currentPassword.length < 6) {
      errors.push("Le mot de passe actuel doit contenir au moins 6 caractères")
    }

    if (passwordData.newPassword.length < 8) {
      errors.push("Le nouveau mot de passe doit contenir au moins 8 caractères")
    }

    if (passwordStrength < 3) {
      errors.push("Le nouveau mot de passe est trop faible")
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push("Les mots de passe ne correspondent pas")
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.push("Le nouveau mot de passe doit être différent de l'ancien")
    }

    return errors
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validatePasswords()
    if (errors.length > 0) {
      toast({
        title: "Erreur de validation",
        description: errors[0],
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Mot de passe modifié",
          description: "Votre mot de passe a été changé avec succès"
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setPasswordStrength(0)
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Une erreur est survenue",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement de mot de passe",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500"
    if (passwordStrength <= 2) return "bg-orange-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    if (passwordStrength <= 4) return "bg-green-500"
    return "bg-emerald-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Très faible"
    if (passwordStrength === 1) return "Faible"
    if (passwordStrength === 2) return "Moyen"
    if (passwordStrength === 3) return "Bon"
    if (passwordStrength === 4) return "Fort"
    return "Très fort"
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Changer le mot de passe</h1>
        <p className="text-muted-foreground">Modifiez votre mot de passe pour sécuriser votre compte</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <Card>
          <CardHeader>
            <CardTitle>Changement de mot de passe</CardTitle>
            <CardDescription>
              Entrez votre mot de passe actuel et choisissez un nouveau mot de passe sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe actuel"
                    className="pl-10 pr-10 h-12"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Entrez le nouveau mot de passe"
                    className="pl-10 pr-10 h-12"
                    value={passwordData.newPassword}
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">Force du mot de passe</Label>
                      <span className="text-xs text-muted-foreground">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <Progress 
                      value={passwordStrength * 20} 
                      className="h-2"
                    />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        {passwordData.newPassword.length >= 8 ? 
                          <Check className="w-3 h-3 text-green-500" /> : 
                          <X className="w-3 h-3 text-red-500" />
                        }
                        Au moins 8 caractères
                      </div>
                      <div className="flex items-center gap-1">
                        {/[A-Z]/.test(passwordData.newPassword) ? 
                          <Check className="w-3 h-3 text-green-500" /> : 
                          <X className="w-3 h-3 text-red-500" />
                        }
                        Une majuscule
                      </div>
                      <div className="flex items-center gap-1">
                        {/[0-9]/.test(passwordData.newPassword) ? 
                          <Check className="w-3 h-3 text-green-500" /> : 
                          <X className="w-3 h-3 text-red-500" />
                        }
                        Un chiffre
                      </div>
                      <div className="flex items-center gap-1">
                        {/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 
                          <Check className="w-3 h-3 text-green-500" /> : 
                          <X className="w-3 h-3 text-red-500" />
                        }
                        Un caractère spécial
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez le nouveau mot de passe"
                    className="pl-10 pr-10 h-12"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
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
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={isLoading || passwordStrength < 3 || passwordData.newPassword !== passwordData.confirmPassword}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
