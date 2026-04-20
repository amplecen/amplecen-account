import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { resolveCookieDomain } from './cookie-domain'

export async function createClient() {
  const cookieStore = await cookies()
  let appHostname = ''
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      appHostname = new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
    } catch {
      // Ignore invalid app URL and fall back to host-only cookies.
      appHostname = ''
    }
  }
  const cookieDomain = resolveCookieDomain(
    appHostname,
    process.env.COOKIE_DOMAIN || process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  )

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                ...(cookieDomain && {
                  domain: cookieDomain,
                  path: '/',
                  sameSite: 'lax' as const,
                  secure: true,
                }),
              })
            )
          } catch {
            // Called from a Server Component — safe to ignore.
            // Proxy will handle session refresh.
          }
        },
      },
    }
  )
}
