import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || "default_secret_for_local_dev";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
      await jwtVerify(session, key, {
        algorithms: ["HS256"],
      })
    } catch (err) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect /login to /dashboard if already logged in
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    if (session) {
      try {
        await jwtVerify(session, key, {
          algorithms: ["HS256"],
        })
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (err) {
        // Just let them go to login if invalid
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
