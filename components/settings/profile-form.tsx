'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/auth'
import { User, Mail, Save, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: {
    id: string
    email: string
    name: string
    avatar: string
    createdAt?: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(user.name)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const result = await updateProfile({ displayName })
      if (result.success) {
        setSaved(true)
        toast.success('Profile updated successfully')
        setTimeout(() => setSaved(false), 2000)
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    })
  }

  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="space-y-8">
      {/* Avatar section */}
      {/* Avatar section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-ember blur-lg opacity-10 rounded-2xl" />
          <img
            src={user.avatar}
            alt={user.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-2xl object-cover relative border-2 border-warm-white/[0.08]"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sage border-4 border-midnight-deep flex items-center justify-center">
            <Check className="w-3 h-3 text-ink" />
          </div>
        </div>
        <div>
          <p className="text-xl font-display font-semibold text-warm-white">{user.name}</p>
          <p className="text-sm text-haze">{user.email}</p>
          {createdDate && (
            <p className="text-xs text-haze-dim mt-1 uppercase tracking-widest font-bold">
              Joined {createdDate}
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-sm font-bold text-haze-dim">
            Display name
          </label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim transition-colors group-focus-within:text-ember" />
            <input
              id="profile-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-midnight-light/10 border border-warm-white/5 text-warm-white placeholder:text-haze-dim/40 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember/40 hover:border-warm-white/10"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="text-sm font-bold text-haze-dim">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-haze-dim/40" />
            <input
              id="profile-email"
              type="email"
              value={user.email}
              disabled
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-midnight-light/5 border border-warm-white/2 text-haze-dim/40 text-sm cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-haze-dim/60">
            Email is managed through your auth provider
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending || displayName === user.name}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-ember-dim via-ember to-ember-bright text-ink font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-ember/25 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
