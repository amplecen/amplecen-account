'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from '@/app/actions/auth'
import { AmplecenLogo } from '@/components/amplecen-logo'
import Link from 'next/link'
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await sendPasswordResetEmail(email)

    if (!result.success) {
      setError(result.error || 'Failed to send reset email.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AmplecenLogo size="lg" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-zinc-500">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl shadow-2xl shadow-black/20">
        {success ? (
          <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Check your email</h3>
              <p className="text-sm text-zinc-400">
                We&apos;ve sent a password reset link to{' '}
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-sm font-medium text-zinc-400">
                Email address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-zinc-600 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 hover:border-white/[0.1]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
