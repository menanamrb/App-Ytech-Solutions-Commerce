"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    // Redirect to our main connexion page with error
    if (error) {
      router.push(`/connexion?error=${error}`)
    } else {
      router.push('/connexion')
    }
  }, [error, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Redirection...
          </CardTitle>
          <CardDescription>
            Vous allez être redirigé vers la page de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/connexion">
            <Button className="w-full">
              Aller à la page de connexion
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
