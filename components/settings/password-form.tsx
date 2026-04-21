'use client'

import { useState, useTransition } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { Lock, Eye, EyeOff, Loader2, Check, Save } from 'lucide-react'
import { toast } from 'sonner'

export function PasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    startTransition(async () => {
      const result = await updatePassword(newPassword)
      if (result.success) {
        setSaved(true)
        setNewPassword('')
        setConfirmPassword('')
        toast.success('Password updated successfully')
        setTimeout(() => setSaved(false), 2000)
      } else {
        toast.error(result.error || 'Failed to update password')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="sec-new-password" className="text-sm font-bold text-haze-dim">
          New password
        </label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
          <input
            id="sec-new-password"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        <label htmlFor="sec-confirm-password" className="text-sm font-bold text-haze-dim">
          Confirm new password
        </label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
          <input
            id="sec-confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-midnight-light/10 border border-warm-white/5 text-warm-white placeholder:text-haze-dim/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember/40 hover:border-warm-white/10"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || !newPassword || !confirmPassword}
          className="btn-primary btn-primary-sm"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Updated' : 'Update password'}
        </button>
      </div>
    </form>
  )
}
