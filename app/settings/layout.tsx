'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AmplecenLogo } from '@/components/amplecen-logo'
import { SignOutButton } from '@/components/auth/signout-button'
import { User, Shield, Link2, ArrowLeft } from 'lucide-react'

const navItems = [
  { href: '/settings/profile', icon: User, label: 'Profile' },
  { href: '/settings/security', icon: Shield, label: 'Security' },
  { href: '/settings/connections', icon: Link2, label: 'Connections' },
]

function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold
              transition-all duration-300
              ${isActive
                ? 'bg-ember/10 text-ember-bright border border-ember/20 shadow-[0_0_15px_rgba(232,133,90,0.05)]'
                : 'text-haze-dim hover:text-warm-white hover:bg-midnight-light/10 border border-transparent'
              }
            `}
          >
            <item.icon className={`w-4 h-4 ${isActive ? 'text-ember' : 'text-haze-dim group-hover:text-warm-white'}`} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-midnight-deep relative font-sans">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[800px] h-[800px] bg-ember/[0.02] rounded-full blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-midnight-light/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-warm-white/[0.04] bg-midnight-deep/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <AmplecenLogo size="sm" />
            <div className="hidden sm:flex items-center gap-2 text-haze-dim">
              <span className="text-midnight-light">/</span>
              <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-haze-dim hover:text-warm-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <SignOutButton variant="ghost" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="md:w-60 flex-shrink-0">
            <div className="md:sticky md:top-28">
              <h2 className="text-[10px] font-bold text-haze-dim/50 uppercase tracking-[0.25em] mb-4 px-3">
                Account Settings
              </h2>
              <SettingsNav />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
