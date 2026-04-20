import { AmplecenLogo } from '@/components/amplecen-logo'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Error — Amplecen ID',
}

export default function AuthCodeErrorPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AmplecenLogo size="lg" />
        </div>
      </div>

      {/* Error Card */}
      <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl shadow-2xl shadow-black/20 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            We couldn&apos;t verify your authentication link. It may have expired or already been used.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-medium text-zinc-300 hover:bg-white/[0.1] hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
