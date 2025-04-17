import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const userData = request.cookies.get('user_data')?.value

  // Auth sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    // Kullanıcı giriş yapmışsa auth sayfalarına erişimi engelle
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        // Admin ise admin paneline, değilse ana sayfaya yönlendir
        if (user.role === 'admin' && user.is_admin) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/', request.url))
      } catch {
        // JSON parse hatası durumunda çerezleri temizle
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        response.cookies.delete('auth_token')
        response.cookies.delete('user_data')
        return response
      }
    }
    return NextResponse.next()
  }

  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || !userData) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      const user = JSON.parse(userData)
      if (user.role !== 'admin' || !user.is_admin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      // JSON parse hatası durumunda çerezleri temizle
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth_token')
      response.cookies.delete('user_data')
      return response
    }
  }

  // Diğer korumalı sayfalara erişim kontrolü
  if (!request.nextUrl.pathname.startsWith('/auth/') && 
      !request.nextUrl.pathname.startsWith('/_next/') && 
      !request.nextUrl.pathname.startsWith('/api/')) {
    if (!token || !userData) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 