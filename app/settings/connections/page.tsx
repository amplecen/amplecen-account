import { getUser, getUserIdentities } from '@/app/actions/auth'
import { ConnectionsList } from '@/components/settings/connections-list'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connected Accounts',
  description: 'Manage your linked OAuth provider accounts.',
}

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ linked?: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/login')

  const identities = await getUserIdentities()
  const params = await searchParams
  const justLinked = params.linked

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Connected Accounts</h1>
        <p className="text-sm text-zinc-500">
          Manage your linked sign-in providers
        </p>
      </div>

      {/* Just linked notification */}
      {justLinked && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-slide-up">
          ✓ Successfully connected {justLinked.charAt(0).toUpperCase() + justLinked.slice(1)}
        </div>
      )}

      <div className="glass-card p-6">
        <ConnectionsList identities={identities} />
      </div>

      {/* Info box */}
      <div className="glass-card p-4 flex items-start gap-3">
        <div className="flex-shrink-0 text-lg mt-0.5">🔒</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-300">About connected accounts</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Connected accounts let you sign in using different providers. You must always keep
            at least one sign-in method active. Connecting a provider doesn&apos;t give it access
            to your Amplecen data.
          </p>
        </div>
      </div>
    </div>
  )
}
