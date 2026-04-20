function sanitizeExplicitDomain(domain?: string): string | undefined {
  if (!domain) return undefined
  const trimmed = domain.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/:\d+$/, '')
}

/**
 * Resolve the cookie domain used for Supabase auth cookies.
 * Returns:
 * - the explicit domain when provided
 * - `.amplecen.com` for any `amplecen.com` host
 * - `undefined` for all other hosts (host-only cookie)
 */
export function resolveCookieDomain(hostname: string, explicitDomain?: string): string | undefined {
  const explicit = sanitizeExplicitDomain(explicitDomain)
  if (explicit) return explicit

  const normalized = normalizeHostname(hostname)
  if (normalized === 'amplecen.com' || normalized.endsWith('.amplecen.com')) {
    return '.amplecen.com'
  }

  return undefined
}
