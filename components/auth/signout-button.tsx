'use client'

import { useState } from 'react'
import { signOut } from '@/app/actions/auth'
import { LogOut, Loader2 } from 'lucide-react'

interface SignOutButtonProps {
  variant?: 'default' | 'ghost' | 'danger'
  className?: string
}

export function SignOutButton({ variant = 'default', className = '' }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut()
  }

  const variants = {
    default: 'glass-card border border-warm-white/5 text-haze hover:bg-midnight-light/20 hover:text-warm-white hover:border-ember/30',
    ghost: 'text-haze-dim hover:text-warm-white hover:bg-midnight-light/10',
    danger: 'bg-ember-dim/10 border border-ember-dim/20 text-ember hover:bg-ember-dim/20 hover:text-ember-bright',
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      Sign out
    </button>
  )
}
