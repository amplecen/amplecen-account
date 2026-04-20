'use client'

import { useState } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { AmplecenLogo } from '@/components/amplecen-logo'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

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

    const result = await updatePassword(password)

    if (!result.success) {
      setError(result.error || 'Failed to update password.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirect after short delay
    setTimeout(() => {
      router.push('/')
    }, 2000)
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
            Set new password
          </h1>
          <p className="text-sm text-zinc-500">
            Choose a strong password for your account
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
              <h3 className="text-xl font-semibold text-white">Password updated</h3>
              <p className="text-sm text-zinc-400">
                Redirecting you to your account...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-sm font-medium text-zinc-400">
                New password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-zinc-600 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 hover:border-white/[0.1]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-new-password" className="text-sm font-medium text-zinc-400">
                Confirm new password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  minLength={6}
                  autoComplete="new-password"
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
                  Update password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
