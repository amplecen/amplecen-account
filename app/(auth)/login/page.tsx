import { LoginForm } from '@/components/auth/login-form'
import { AmplecenLogo } from '@/components/amplecen-logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Amplecen ID',
  description: 'Sign in to your Amplecen account. One account for all Amplecen products.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ return_to?: string; error?: string }>
}) {
  const params = await searchParams
  const returnTo = params.return_to
  const error = params.error

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AmplecenLogo size="lg" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Sign in to your Amplecen account
          </p>
        </div>
      </div>

      {/* OAuth error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error === 'oauth_callback_failed'
            ? 'Sign in failed. Please try again.'
            : 'An error occurred. Please try again.'}
        </div>
      )}

      {/* Auth Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl shadow-2xl shadow-black/20">
        <LoginForm returnTo={returnTo} />
      </div>
    </div>
  )
}
