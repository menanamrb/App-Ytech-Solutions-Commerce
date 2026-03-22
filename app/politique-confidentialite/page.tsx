import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Ytech Solutions',
  description: 'Politique de confidentialité et protection des données personnelles de Ytech Solutions',
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/connexion" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la connexion
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Politique de Confidentialité</CardTitle>
              <CardDescription>
                Notre engagement pour la protection de vos données personnelles
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-lg font-semibold mb-4">1. Introduction</h2>
                <p>
                  Ytech Solutions s'engage à protéger la vie privée de ses utilisateurs et à garantir la sécurité de leurs données personnelles. 
                  Cette politique explique quelles informations nous collectons, comment nous les utilisons et avec qui nous les partageons.
                </p>

                <h2 className="text-lg font-semibold mb-4">2. Données Collectées</h2>
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Données d'identification
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-6">
                    <li>Nom, prénom</li>
                    <li>Adresse email</li>
                    <li>Mot de passe hashé</li>
                    <li>Adresse IP (à des fins de sécurité)</li>
                    <li>Données de connexion (dates, heures)</li>
                  </ul>
                  
                  <h3 className="font-medium flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Données de profil
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-6">
                    <li>Photo de profil (si fournie)</li>
                    <li>Préférences utilisateur</li>
                    <li>Historique des devis</li>
                    <li>Communications avec le support</li>
                  </ul>
                  
                  <h3 className="font-medium flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Données techniques
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-6">
                    <li>Cookies et technologies similaires</li>
                    <li>Logs de sécurité</li>
                    <li>Données analytiques anonymisées</li>
                  </ul>
                </div>

                <h2 className="text-lg font-semibold mb-4">3. Utilisation des Données</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">3.1. Finalités principales</h3>
                  <ul className="list-disc list-inside space-y-2 ml-6">
                    <li>Fournir et maintenir la plateforme fonctionnelle</li>
                    <li>Gérer votre compte et vos préférences</li>
                    <li>Personnaliser votre expérience utilisateur</li>
                    <li>Assurer la sécurité et la prévention des fraudes</li>
                    <li>Communiquer avec vous concernant le service</li>
                  </ul>
                  
                  <h3 className="font-medium">3.2. Base légale</h3>
                  <p>Nous utilisons vos données uniquement sur la base de votre consentement, du contrat et des obligations légales.</p>
                  
                  <h3 className="font-medium">3.3. Conservation</h3>
                  <p>Vos données sont conservées uniquement le temps nécessaire à l'accomplissement des finalités ci-dessus.</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">4. Partage des Données</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">4.1. Partenaires prestataires</h3>
                  <p>Nous pouvons partager vos données avec des prestataires de services qualifiés pour :</p>
                  <ul className="list-disc list-inside space-y-2 ml-6">
                    <li>L'exécution des services que vous demandez</li>
                    <li>L'envoi de communications transactionnelles</li>
                    <li>L'analyse et l'amélioration de nos services</li>
                  </ul>
                  
                  <h3 className="font-medium">4.2. Transferts légaux</h3>
                  <p>Nous pouvons transférer vos données dans le cadre de fusions, acquisitions ou obligations légales.</p>
                  
                  <h3 className="font-medium">4.3. Non-partage</h3>
                  <p>Ne vendons, ne louons et ne partageons pas vos données avec des tiers à des fins marketing.</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">5. Sécurité des Données</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">5.1. Mesures techniques</h3>
                  <ul className="list-disc list-inside space-y-2 ml-6">
                    <li>Chiffrement SSL/TLS pour toutes les communications</li>
                    <li>Hachage des mots de passe (bcrypt)</li>
                    <li>Pare-feu et systèmes de détection d'intrusions</li>
                    <li>Accès sécurisé et contrôlé aux données</li>
                    <li>Sauvegardes régulières et chiffrées</li>
                  </ul>
                  
                  <h3 className="font-medium">5.2. Vos responsabilités</h3>
                  <p>Vous êtes responsable de la sécurité de votre compte et de la confidentialité de vos identifiants.</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">6. Vos Droits</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">6.1. Accès et rectification</h3>
                  <p>Vous avez le droit d'accéder, de mettre à jour ou de corriger vos données personnelles.</p>
                  
                  <h3 className="font-medium">6.2. Opposition et suppression</h3>
                  <p>Vous pouvez vous opposer au traitement ou demander la suppression de vos données.</p>
                  
                  <h3 className="font-medium">6.3. Portabilité</h3>
                  <p>Vous pouvez demander la portabilité de vos données vers un autre service.</p>
                  
                  <h3 className="font-medium">6.4. Limitation du traitement</h3>
                  <p>Vous pouvez limiter le traitement de vos données.</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">7. Cookies et Technologies Similaires</h2>
                <p>
                  Nous utilisons des cookies et technologies similaires pour améliorer votre expérience. Vous pouvez contrôler ces paramètres 
                  dans votre navigateur.
                </p>

                <h2 className="text-lg font-semibold mb-4">8. Modifications de la Politique</h2>
                <p>
                  Toute modification de cette politique sera notifiée par email et publiée sur notre site. 
                  L'utilisation continue après modification vaut acceptation des nouvelles conditions.
                </p>

                <h2 className="text-lg font-semibold mb-4">9. Contact DPO</h2>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Délégué à la Protection des Données :</strong> dpo@ytechsolutions.com</p>
                  <p><strong>Adresse postale :</strong> Ytech Solutions, DPO, 123 Rue de la Sécurité, 75001 Paris, France</p>
                </div>
              </div>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-muted-foreground text-center">
                  Cette politique est effective depuis le 1er janvier 2024 et peut être modifiée à tout moment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
