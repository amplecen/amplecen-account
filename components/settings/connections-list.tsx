'use client'

import { useState, useTransition } from 'react'
import { linkProvider, unlinkProvider, type OAuthProvider, type LinkedIdentity } from '@/app/actions/auth'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaDiscord, FaFacebookF, FaTwitch } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { Link2, Unlink, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

const providerMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  google: { label: 'Google', icon: <FcGoogle className="w-5 h-5" />, color: 'text-warm-white' },
  github: { label: 'GitHub', icon: <FaGithub className="w-5 h-5" />, color: 'text-warm-white' },
  discord: { label: 'Discord', icon: <FaDiscord className="w-5 h-5 text-[#5865F2]" />, color: 'text-[#5865F2]' },
  facebook: { label: 'Facebook', icon: <FaFacebookF className="w-4 h-4 text-[#1877F2]" />, color: 'text-[#1877F2]' },
  x: { label: 'X', icon: <FaXTwitter className="w-4 h-4 text-white" />, color: 'text-white' },
  twitch: { label: 'Twitch', icon: <FaTwitch className="w-4 h-4 text-[#9146FF]" />, color: 'text-[#9146FF]' },
  email: { label: 'Email', icon: <span className="text-lg">📧</span>, color: 'text-warm-white' },
}

const linkableProviders: OAuthProvider[] = ['google', 'github', 'discord', 'facebook', 'x', 'twitch']

interface ConnectionsListProps {
  identities: LinkedIdentity[]
}

export function ConnectionsList({ identities }: ConnectionsListProps) {
  const [isPending, startTransition] = useTransition()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const linkedProviderNames = identities.map(i => i.provider)
  const unlinkableProviders = linkableProviders.filter(p => !linkedProviderNames.includes(p))

  function handleLink(provider: OAuthProvider) {
    setLoadingAction(`link-${provider}`)
    startTransition(async () => {
      const result = await linkProvider(provider)
      if (!result.success) {
        toast.error(result.error || `Failed to link ${provider}`)
      }
      setLoadingAction(null)
    })
  }

  function handleUnlink(identity: LinkedIdentity) {
    if (identities.length <= 1) {
      toast.error("Cannot remove your only login method")
      return
    }

    setLoadingAction(`unlink-${identity.id}`)
    startTransition(async () => {
      const result = await unlinkProvider(identity.id)
      if (result.success) {
        toast.success(`${providerMeta[identity.provider]?.label || identity.provider} disconnected`)
      } else {
        toast.error(result.error || 'Failed to unlink provider')
      }
      setLoadingAction(null)
    })
  }

  return (
    <div className="space-y-8">
      {/* Linked accounts */}
      {identities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-haze-dim uppercase tracking-[0.2em]">Connected Accounts</h3>
          <div className="grid grid-cols-1 gap-2">
            {identities.map((identity) => {
              const meta = providerMeta[identity.provider] || {
                label: identity.provider,
                icon: <span className="text-lg">🔗</span>,
                color: 'text-warm-white',
              }
              const isOnlyIdentity = identities.length <= 1
              const isLoading = loadingAction === `unlink-${identity.id}`

              return (
                <div
                   key={identity.id}
                   className="flex items-center justify-between p-4 rounded-xl glass-card border border-warm-white/5 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-midnight-light/20 flex items-center justify-center border border-haze/10">
                      {meta.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-warm-white">{meta.label}</p>
                      {identity.email && (
                        <p className="text-xs text-haze-dim mt-0.5">{identity.email}</p>
                      )}
                    </div>
                  </div>

                  {isOnlyIdentity ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ember/5 text-[10px] font-bold uppercase tracking-widest text-ember border border-ember/20">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Primary login</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlink(identity)}
                      disabled={isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-haze-dim hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Unlink className="w-3.5 h-3.5" />
                      )}
                      Disconnect
                    </button>
                   )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available to link */}
      {unlinkableProviders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-haze-dim uppercase tracking-[0.2em]">Available to Connect</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlinkableProviders.map((provider) => {
              const meta = providerMeta[provider]
              const isLoading = loadingAction === `link-${provider}`

              return (
                <div
                  key={provider}
                  className="flex items-center justify-between p-4 rounded-xl glass-card-hover border border-warm-white/5 border-dashed"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-midnight-light/10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                      {meta.icon}
                    </div>
                    <p className="text-sm font-bold text-haze-dim group-hover:text-warm-white transition-colors">{meta.label}</p>
                  </div>

                  <button
                    onClick={() => handleLink(provider)}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-ember hover:text-ember-bright bg-ember/5 hover:bg-ember/10 border border-ember/20 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                    Connect
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
