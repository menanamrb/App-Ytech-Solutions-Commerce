import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the user is trying to access dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Get the token from NextAuth
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    // If no token or not authenticated, redirect to login
    if (!token) {
      const loginUrl = new URL('/connexion', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user has admin role
    if (token.role !== 'admin') {
      const loginUrl = new URL('/connexion', request.url)
      loginUrl.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
