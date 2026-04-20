/**
 * Parse and validate the return_to query parameter.
 * Only allow redirects to *.amplecen.com subdomains for security.
 */
export function getReturnTo(
  searchParams: URLSearchParams | { get: (key: string) => string | null },
  fallback?: string
): string {
  const raw = searchParams.get('return_to')
  const defaultUrl = fallback || process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_URL || '/'

  if (!raw) return defaultUrl

  try {
    const url = new URL(decodeURIComponent(raw))
    // Security: only allow redirects to *.amplecen.com or localhost
    if (
      url.hostname.endsWith('.amplecen.com') ||
      url.hostname === 'amplecen.com' ||
      url.hostname === 'localhost'
    ) {
      return url.toString()
    }
  } catch {
    // Invalid URL — ignore
  }

  return defaultUrl
}

/**
 * Get the base URL for this app (accounts.amplecen.com).
 */
export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://amplecen.com'
}
