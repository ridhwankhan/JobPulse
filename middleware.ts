import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || "default_secret_for_local_dev";
const key = new TextEncoder().encode(secretKey);
const RATE_WINDOW_MS = 60 * 1000;
const API_LIMIT = 120;
const AUTH_LIMIT = 25;
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function takeRateToken(bucketKey: string, limit: number) {
  const now = Date.now();
  if (ipBuckets.size > 5000) {
    for (const [k, v] of ipBuckets.entries()) {
      if (now > v.resetAt) ipBuckets.delete(k);
    }
  }
  const current = ipBuckets.get(bucketKey);
  if (!current || now > current.resetAt) {
    ipBuckets.set(bucketKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export async function middleware(request: NextRequest) {
  const ip =
    request.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api/")) {
    const isAuthApi = path.startsWith("/api/auth/");
    const allowed = takeRateToken(`${ip}:${isAuthApi ? "auth" : "api"}`, isAuthApi ? AUTH_LIMIT : API_LIMIT);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }
  }

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
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password'
  ) {
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
  matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password', '/api/:path*'],
}
