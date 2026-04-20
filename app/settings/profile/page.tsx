import { getUser } from '@/app/actions/auth'
import { ProfileForm } from '@/components/settings/profile-form'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your display name, email, and avatar.',
}

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile</h1>
        <p className="text-sm text-zinc-500">
          Manage how you appear across Amplecen products
        </p>
      </div>

      <div className="glass-card p-6">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
