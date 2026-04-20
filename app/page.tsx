import { getUser, getUserIdentities } from '@/app/actions/auth'
import { AmplecenLogo } from '@/components/amplecen-logo'
import { SignOutButton } from '@/components/auth/signout-button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  User,
  Shield,
  Link2,
  Settings,
  ArrowUpRight,
  Mail,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Account Hub',
  description: 'Manage your Amplecen account, view connected products, and access settings.',
}

export default async function AccountHub() {
  const user = await getUser()
  if (!user) redirect('/login')

  const identities = await getUserIdentities()
  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null

  const settingsLinks = [
    { href: '/settings/profile', icon: User, label: 'Profile', desc: 'Name, email, avatar' },
    { href: '/settings/security', icon: Shield, label: 'Security', desc: 'Password & authentication' },
    { href: '/settings/connections', icon: Link2, label: 'Connections', desc: `${identities.length} linked account${identities.length !== 1 ? 's' : ''}` },
  ]

  const products = [
    {
      name: 'Rhythmé',
      description: 'Task management & productivity',
      href: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_URL || 'https://rhythme.amplecen.com',
      icon: '/rhythme.png',
      gradient: 'from-violet-500/20 to-fuchsia-500/20',
      borderColor: 'border-violet-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-[#06060a] relative">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[800px] h-[800px] bg-ember/[0.03] rounded-full blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-midnight-light/[0.05] rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-warm-white/[0.04] bg-midnight-deep/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <AmplecenLogo size="sm" />
          <SignOutButton variant="ghost" />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome */}
        <div className="space-y-1 animate-fade-in">
          <h1 className="text-4xl font-display font-bold text-warm-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-haze-dim font-medium">
            Manage your Amplecen identity and connected products
          </p>
        </div>

        {/* User Info Card */}
        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-ember blur-lg opacity-20 rounded-2xl" />
              <img
                src={user.avatar}
                alt={user.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-cover relative border-2 border-warm-white/[0.08]"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sage border-4 border-midnight-deep" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-4 text-center sm:text-left">
              <div>
                <h2 className="text-xl font-display font-semibold text-warm-white truncate">{user.name}</h2>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm text-haze">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  {createdDate && (
                    <span className="flex items-center gap-1.5 text-sm text-haze-dim">
                      <Calendar className="w-3.5 h-3.5" />
                      Member since {createdDate}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href="/settings/profile"
                className="inline-flex items-center gap-1.5 text-sm text-ember hover:text-ember-bright transition-colors font-bold uppercase tracking-wider"
              >
                <Settings className="w-3.5 h-3.5" />
                Account Settings
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xs font-bold text-haze-dim uppercase tracking-[0.2em]">
            Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {settingsLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card-hover p-5 flex flex-col gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-midnight-light/20 border border-haze/10 text-haze group-hover:text-ember group-hover:border-ember/30 transition-all duration-300 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-warm-white group-hover:text-ember-bright transition-colors">{item.label}</p>
                  <p className="text-xs text-haze-dim mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-xs font-bold text-haze-dim uppercase tracking-[0.2em]">
            Connected Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <a
                key={product.name}
                href={product.href}
                className="glass-card-hover p-6 flex items-center justify-between group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-ember/5 blur-3xl -mr-8 -mt-8 rounded-full" />
                <div className="flex items-center gap-5 relative z-10">
                  <Image
                    src={product.icon}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-midnight-light to-midnight border border-haze/10 flex items-center justify-center text-3xl shadow-xl group-hover:border-ember/30 transition-colors"
                  />
                  <div>
                    <p className="text-lg font-display font-bold text-warm-white group-hover:text-ember-bright transition-colors">{product.name}</p>
                    <p className="text-sm text-haze-dim mt-0.5">{product.description}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-haze-dim group-hover:text-ember transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}

            {/* Coming soon placeholder */}
            <div className="glass-card p-6 flex flex-col items-center justify-center border-dashed border-warm-white/[0.04] text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-midnight-light/10 border border-warm-white/5 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-xs font-medium text-haze-dim/50 uppercase tracking-widest">More coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
