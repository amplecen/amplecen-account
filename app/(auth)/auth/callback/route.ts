import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { getReturnTo } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const returnTo = getReturnTo(requestUrl.searchParams)

  // Account linking callback
  const linked = requestUrl.searchParams.get('linked')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Account linking — redirect back to connections settings
      if (linked) {
        return NextResponse.redirect(`${origin}/settings/connections?linked=${linked}`)
      }

      // Normal login — redirect to return_to (product app or default)
      return NextResponse.redirect(returnTo)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)
}
