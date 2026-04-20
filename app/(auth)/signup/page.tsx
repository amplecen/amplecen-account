import { SignupForm } from '@/components/auth/signup-form'
import { AmplecenLogo } from '@/components/amplecen-logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — Amplecen ID',
  description: 'Create your Amplecen account. One account for all Amplecen products.',
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ return_to?: string }>
}) {
  const params = await searchParams
  const returnTo = params.return_to

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AmplecenLogo size="lg" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500">
            One account for all Amplecen products
          </p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl shadow-2xl shadow-black/20">
        <SignupForm returnTo={returnTo} />
      </div>
    </div>
  )
}
