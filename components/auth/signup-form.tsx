'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from './oauth-buttons'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

interface SignupFormProps {
  returnTo?: string
}

export function SignupForm({ returnTo }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const origin = window.location.origin

      const emailRedirectTo = returnTo
        ? `${origin}/auth/confirm?return_to=${encodeURIComponent(returnTo)}`
        : `${origin}/auth/confirm`

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Try signing in instead.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const loginHref = returnTo ? `/login?return_to=${encodeURIComponent(returnTo)}` : '/login'

  // Success state
  if (success) {
    return (
      <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center text-sage">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-warm-white">Check your email</h3>
          <p className="text-sm text-haze-dim max-w-sm mx-auto">
            We&apos;ve sent a confirmation link to{' '}
            <span className="text-warm-white font-medium">{email}</span>.
            Please check your inbox and click the link to activate your account.
          </p>
        </div>
        <div className="pt-2">
          <p className="text-xs text-haze-dim">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => { setSuccess(false); setLoading(false) }}
              className="text-ember hover:text-ember-bright transition-colors"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <OAuthButtons returnTo={returnTo} mode="signup" />

      {/* Divider */}
      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-warm-white/[0.08] to-transparent" />
        <span className="text-xs font-sans font-medium text-haze-dim uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-warm-white/[0.08] to-transparent" />
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium text-haze-dim">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-midnight-light/10 border border-warm-white/5 text-warm-white placeholder:text-haze-dim/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember/40 hover:border-warm-white/10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-haze-dim">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full pl-11 pr-12 py-3 rounded-xl bg-midnight-light/10 border border-warm-white/5 text-warm-white placeholder:text-haze-dim/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember/40 hover:border-warm-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-haze-dim hover:text-warm-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-confirm" className="text-sm font-medium text-haze-dim">
            Confirm password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
            <input
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-midnight-light/10 border border-warm-white/5 text-warm-white placeholder:text-haze-dim/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember/40 hover:border-warm-white/10"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-haze-dim">
        Already have an account?{' '}
        <Link
          href={loginHref}
          className="text-ember hover:text-ember-bright font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
