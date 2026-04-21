'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OAuthButtons } from './oauth-buttons'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

interface LoginFormProps {
  returnTo?: string
}

export function LoginForm({ returnTo }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      // Redirect to return_to or default product
      const destination = returnTo || process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_URL || '/'
      window.location.href = destination
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const signupHref = returnTo ? `/signup?return_to=${encodeURIComponent(returnTo)}` : '/signup'
  const resetHref = '/auth/reset-password'

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <OAuthButtons returnTo={returnTo} mode="login" />

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
          <label htmlFor="login-email" className="text-sm font-medium text-haze-dim">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
            <input
              id="login-email"
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
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-sm font-medium text-haze-dim">
              Password
            </label>
            <Link
              href={resetHref}
              className="text-xs text-ember/80 hover:text-ember-bright transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
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
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Signup link */}
      <p className="text-center text-sm text-haze-dim">
        Don&apos;t have an account?{' '}
        <Link
          href={signupHref}
          className="text-ember hover:text-ember-bright font-semibold transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
