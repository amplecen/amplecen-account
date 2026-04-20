import { createBrowserClient } from '@supabase/ssr'
import { resolveCookieDomain } from './cookie-domain'

export function createClient() {
  const cookieDomain = resolveCookieDomain(
    window.location.hostname,
    process.env.NEXT_PUBLIC_COOKIE_DOMAIN // '.amplecen.com' in prod
  )

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    cookieDomain
      ? {
          cookieOptions: {
            domain: cookieDomain,
            path: '/',
            sameSite: 'lax' as const,
            secure: window.location.protocol === 'https:',
          },
        }
      : undefined
  )
}
