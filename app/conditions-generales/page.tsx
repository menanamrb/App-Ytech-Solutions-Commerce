import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation - Ytech Solutions',
  description: 'Conditions générales d\'utilisation de la plateforme Ytech Solutions',
}

export default function ConditionsPage() {
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
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">Conditions Générales d'Utilisation</CardTitle>
              <CardDescription>
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <h2 className="text-lg font-semibold mb-4">1. Acceptation des Conditions</h2>
                <p>
                  En créant un compte sur Ytech Solutions, vous acceptez sans réserve les présentes conditions générales d'utilisation (CGU). 
                  L'accès à la plateforme et son utilisation sont subordonnés à votre acceptation complète et sans équivoque de ces conditions.
                </p>

                <h2 className="text-lg font-semibold mb-4">2. Description du Service</h2>
                <p>
                  Ytech Solutions est une plateforme de devis et services numériques. Nous mettons en relation des clients avec des prestataires 
                  de services qualifiés pour divers besoins numériques.
                </p>

                <h2 className="text-lg font-semibold mb-4">3. Obligations de l'Utilisateur</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">3.1. Informations exactes</h3>
                  <p>Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription.</p>
                  
                  <h3 className="font-medium">3.2. Utilisation responsable</h3>
                  <p>Vous vous engagez à utiliser la plateforme de manière responsable et conforme aux lois en vigueur.</p>
                  
                  <h3 className="font-medium">3.3. Sécurité du compte</h3>
                  <p>Vous êtes responsable de la sécurité de votre compte et de vos identifiants de connexion.</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">4. Propriété Intellectuelle</h2>
                <p>
                  Tout le contenu, les marques, les logos et autres éléments de propriété intellectuelle présents sur la plateforme 
                  sont la propriété exclusive de Ytech Solutions ou de ses partenaires. Toute reproduction ou utilisation non autorisée est strictement interdite.
                </p>

                <h2 className="text-lg font-semibold mb-4">5. Confidentialité et Données Personnelles</h2>
                <p>
                  Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité. 
                  Consultez notre <Link href="/politique-confidentialite" className="text-primary hover:underline">politique de confidentialité</Link> pour plus d'informations.
                </p>

                <h2 className="text-lg font-semibold mb-4">6. Limitation de Responsabilité</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">6.1. Service fourni "en l'état"</h3>
                  <p>La plateforme est fournie "en l'état", sans garantie d'interruption ou d'absence d'erreurs.</p>
                  
                  <h3 className="font-medium">6.2. Exclusion de responsabilité</h3>
                  <p>Ytech Solutions ne peut être tenue responsable des dommages directs, indirects, accessoires ou consécutifs 
                  découlant de l'utilisation de la plateforme.</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">7. Résiliation</h2>
                <p>
                  Vous pouvez résilier votre compte à tout moment en suivant la procédure prévue dans les paramètres de votre compte. 
                  La résiliation prendra effet immédiatement.
                </p>

                <h2 className="text-lg font-semibold mb-4">8. Modifications des Conditions</h2>
                <p>
                  Ytech Solutions se réserve le droit de modifier ces conditions à tout moment. Les modifications seront notifiées 
                  par email ou publication sur la plateforme. Votre utilisation continue après modification vaut acceptation des nouvelles conditions.
                </p>

                <h2 className="text-lg font-semibold mb-4">9. Loi Applicable</h2>
                <p>
                  Les présentes conditions sont régies par le droit français. Tout litige sera soumis à la compétence des tribunaux français.
                </p>

                <h2 className="text-lg font-semibold mb-4">10. Contact</h2>
                <p>
                  Pour toute question concernant ces conditions, vous pouvez nous contacter à :
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email :</strong> support@ytechsolutions.com</p>
                  <p><strong>Téléphone :</strong> +33 1 XX XX XX XX XX</p>
                </div>
              </div>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-muted-foreground text-center">
                  En cliquant sur "S'inscrire", vous confirmez avoir lu, compris et accepté les présentes conditions générales d'utilisation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
