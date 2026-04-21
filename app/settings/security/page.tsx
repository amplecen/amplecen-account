import { getUser } from '@/app/actions/auth'
import { PasswordForm } from '@/components/settings/password-form'
import { redirect } from 'next/navigation'
import { Shield, Fingerprint, Smartphone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Settings',
  description: 'Manage your password and security settings.',
}

export default async function SecurityPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-warm-white tracking-tight">Security</h1>
        <p className="text-sm text-haze-dim">
          Manage your password and authentication methods
        </p>
      </div>

      {/* Password section */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ember/10 border border-ember/20 text-ember">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-warm-white">Change password</h2>
            <p className="text-xs text-haze-dim">Update your password to keep your account secure</p>
          </div>
        </div>
        <PasswordForm />
      </div>

      {/* Future features */}
      <div className="space-y-3">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-midnight-light/20 border border-haze/10 text-haze-dim flex-shrink-0">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-warm-white/60">Passkeys</p>
            <p className="text-xs text-haze-dim/60">Sign in with biometrics or security keys</p>
          </div>
          <span className="text-[10px] font-bold text-haze-dim/50 uppercase tracking-widest px-2.5 py-1 rounded-full bg-midnight-light/10 border border-haze/10 whitespace-nowrap flex-shrink-0">
            Coming soon
          </span>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-midnight-light/20 border border-haze/10 text-haze-dim flex-shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-warm-white/60">Two-factor authentication</p>
            <p className="text-xs text-haze-dim/60">Add an extra layer of security with TOTP</p>
          </div>
          <span className="text-[10px] font-bold text-haze-dim/50 uppercase tracking-widest px-2.5 py-1 rounded-full bg-midnight-light/10 border border-haze/10 whitespace-nowrap flex-shrink-0">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  )
}
