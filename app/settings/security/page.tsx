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
        <h1 className="text-2xl font-bold text-white tracking-tight">Security</h1>
        <p className="text-sm text-zinc-500">
          Manage your password and authentication methods
        </p>
      </div>

      {/* Password section */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Change password</h2>
            <p className="text-xs text-zinc-500">Update your password to keep your account secure</p>
          </div>
        </div>
        <PasswordForm />
      </div>

      {/* Future features */}
      <div className="space-y-3">
        <div className="glass-card p-5 flex items-center gap-4 opacity-50">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-500">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400">Passkeys</p>
            <p className="text-xs text-zinc-600">Sign in with biometrics or security keys</p>
          </div>
          <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            Coming soon
          </span>
        </div>

        <div className="glass-card p-5 flex items-center gap-4 opacity-50">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-500">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-400">Two-factor authentication</p>
            <p className="text-xs text-zinc-600">Add an extra layer of security with TOTP</p>
          </div>
          <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  )
}
