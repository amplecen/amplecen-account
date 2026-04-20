import { createBrowserClient } from '@supabase/ssr'
import { resolveCookieDomain } from './cookie-domain'

export function createClient() {
  const cookieDomain = resolveCookieDomain(
    typeof window !== 'undefined' ? window.location.hostname : '',
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
            secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true,
          },
        }
      : undefined
  )
}
