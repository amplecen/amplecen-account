'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaDiscord, FaFacebookF, FaTwitch } from 'react-icons/fa'
import type { OAuthProvider } from '@/app/actions/auth'
import { FaXTwitter } from 'react-icons/fa6'

const providers: { id: OAuthProvider; label: string; icon: React.ReactNode }[] = [
  { id: 'google', label: 'Google', icon: <FcGoogle className="w-5 h-5" /> },
  { id: 'github', label: 'GitHub', icon: <FaGithub className="w-5 h-5" /> },
  { id: 'discord', label: 'Discord', icon: <FaDiscord className="w-5 h-5 text-[#5865F2]" /> },
  { id: 'facebook', label: 'Facebook', icon: <FaFacebookF className="w-4 h-4 text-[#1877F2]" /> },
  { id: 'twitter', label: 'X', icon: <FaXTwitter className="w-4 h-4 text-white" /> },
  { id: 'twitch', label: 'Twitch', icon: <FaTwitch className="w-4 h-4 text-[#9146FF]" /> },
]

interface OAuthButtonsProps {
  returnTo?: string
  mode?: 'login' | 'signup'
}

export function OAuthButtons({ returnTo, mode = 'login' }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)

  async function handleOAuth(provider: OAuthProvider) {
    setLoadingProvider(provider)
    try {
      const supabase = createClient()
      const origin = window.location.origin

      const callbackUrl = new URL(`${origin}/auth/callback`)
      if (returnTo) {
        callbackUrl.searchParams.set('return_to', returnTo)
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
        },
      })

      if (error) throw error
      if (data.url) window.location.assign(data.url)
    } catch (err) {
      console.error(`OAuth ${provider} error:`, err)
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleOAuth(p.id)}
            className="
              relative flex items-center justify-center p-3 rounded-xl
              glass-card-hover border border-warm-white/5
              transition-all duration-300 ease-out
              hover:border-ember/40 hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
            title={`${mode === 'login' ? 'Sign in' : 'Sign up'} with ${p.label}`}
          >
            {loadingProvider === p.id ? (
              <div className="w-5 h-5 border-2 border-haze/20 border-t-ember rounded-full animate-spin" />
            ) : (
              <span className="transition-transform duration-300 group-hover:scale-110">
                {p.icon}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
