function isAmplecenHostname(hostname: string): boolean {
  if (!hostname) return false
  return hostname === 'amplecen.com' || hostname.endsWith('.amplecen.com')
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/:\d+$/, '')
}

function sanitizeExplicitDomain(domain?: string): string | undefined {
  if (!domain) return undefined
  const trimmed = domain.trim()
  if (trimmed.length === 0) return undefined

  // Allow URL-like env values (e.g. https://accounts.amplecen.com)
  // by extracting the hostname.
  const trimmedWithoutTrailingSlash = trimmed.replace(/\/+$/, '')
  const withProtocol = /^https?:\/\//i.test(trimmedWithoutTrailingSlash)
    ? trimmedWithoutTrailingSlash
    : `https://${trimmedWithoutTrailingSlash}`

  try {
    const hostname = normalizeHostname(new URL(withProtocol).hostname)
    if (isAmplecenHostname(hostname)) {
      return '.amplecen.com'
    }
    return hostname
  } catch {
    // Fallback to plain domain-like strings without protocol.
    const plain = normalizeHostname(trimmedWithoutTrailingSlash)
    if (!plain) return undefined
    if (isAmplecenHostname(plain)) {
      return '.amplecen.com'
    }
    return plain
  }
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
