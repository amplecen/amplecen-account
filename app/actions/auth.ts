'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// ─── Types ────────────────────────────────────────────────────────
export type OAuthProvider = 'google' | 'github' | 'discord' | 'apple' | 'facebook' | 'twitter' | 'twitch'

// ─── URL Helper ───────────────────────────────────────────────────
async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    if (host) return `${protocol}://${host}`
  } catch { /* fallthrough */ }
  return 'https://amplecen.com'
}

// ─── Auth Actions ─────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || user.email!.split('@')[0],
    avatar: user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}`,
    createdAt: user.created_at,
  }
}

export async function getFullUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ─── OAuth ────────────────────────────────────────────────────────
export async function signInWithProviderAction(
  provider: OAuthProvider,
  returnTo?: string,
) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const callbackUrl = new URL(`${baseUrl}/auth/callback`)
  if (returnTo) {
    callbackUrl.searchParams.set('return_to', returnTo)
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (error) throw new Error(error.message)
  redirect(data.url)
}

// ─── Identity Management (Connected Accounts) ────────────────────
export interface LinkedIdentity {
  id: string
  provider: string
  email?: string
  name?: string
  avatar?: string
  createdAt?: string
  lastSignIn?: string
}

export async function getUserIdentities(): Promise<LinkedIdentity[]> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user || !user.identities) return []

  return user.identities.map((identity) => ({
    id: identity.id,
    provider: identity.provider,
    email: identity.identity_data?.email,
    name: identity.identity_data?.full_name || identity.identity_data?.name,
    avatar: identity.identity_data?.avatar_url || identity.identity_data?.picture,
    createdAt: identity.created_at,
    lastSignIn: identity.last_sign_in_at,
  }))
}

export async function linkProvider(provider: OAuthProvider) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()

  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `${baseUrl}/auth/callback?linked=${provider}`,
    },
  })

  if (error) return { success: false, error: error.message }
  if (data.url) redirect(data.url)
  return { success: true }
}

export async function unlinkProvider(identityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.identities) return { success: false, error: "User not found" }
  if (user.identities.length <= 1) return { success: false, error: "Cannot remove your only login method." }

  const identity = user.identities.find(i => i.id === identityId)
  if (!identity) return { success: false, error: "Identity not found" }

  const { error } = await supabase.auth.unlinkIdentity(identity)
  if (error) {
    if (error.message.includes('manual linking')) {
      return { success: false, error: "Account unlinking is not enabled. Please contact support." }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/settings/connections')
  return { success: true }
}

// ─── Password Management ─────────────────────────────────────────
export async function updatePassword(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = await createClient()
  const baseUrl = await getBaseUrl()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/confirm?type=recovery`,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── Profile Management ──────────────────────────────────────────
export async function updateProfile(data: {
  displayName?: string
  avatarUrl?: string
}) {
  const supabase = await createClient()
  const updateData: Record<string, string> = {}

  if (data.displayName) {
    updateData.display_name = data.displayName
    updateData.full_name = data.displayName
  }
  if (data.avatarUrl) {
    updateData.avatar_url = data.avatarUrl
  }

  const { error } = await supabase.auth.updateUser({ data: updateData })
  if (error) return { success: false, error: error.message }

  revalidatePath('/settings/profile')
  revalidatePath('/')
  return { success: true }
}
