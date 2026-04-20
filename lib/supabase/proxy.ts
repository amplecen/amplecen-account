import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const cookieDomain = process.env.COOKIE_DOMAIN

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              ...(cookieDomain && {
                domain: cookieDomain,
                path: '/',
                sameSite: 'lax' as const,
                secure: true,
              }),
            })
          )
        },
      },
    }
  )

  // Refresh session — MUST be called before any other supabase calls
  const { data: { user } } = await supabase.auth.getUser()

  // Auth pages (login, signup, reset-password) — redirect to home if already logged in
  const isAuthRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname.startsWith('/auth/reset-password')

  if (user && isAuthRoute) {
    // If there's a return_to param, honor it
    const returnTo = request.nextUrl.searchParams.get('return_to')
    if (returnTo) {
      return NextResponse.redirect(returnTo)
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protected routes (settings, account management) — redirect to login if not authenticated
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname === '/'

  // But NOT the auth routes themselves
  const isPublicRoute =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname.startsWith('/auth/') ||
    request.nextUrl.pathname.startsWith('/account/')

  if (!user && isProtectedRoute && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('return_to', request.nextUrl.href)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
