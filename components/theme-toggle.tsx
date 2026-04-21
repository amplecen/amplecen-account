'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

type Intensity = 'vivid' | 'subtle' | 'off'

const levels: Record<Intensity, number> = {
  vivid:  1,
  subtle: 0.45,
  off:    0,
}

const labels: Intensity[] = ['vivid', 'subtle', 'off']

export function ThemeToggle() {
  const [intensity, setIntensity] = useState<Intensity>('vivid')
  const [open, setOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ambient-intensity') as Intensity | null
    if (stored && levels[stored] !== undefined) {
      setIntensity(stored)
      document.documentElement.style.setProperty('--ambient-opacity', String(levels[stored]))
    }
  }, [])

  function choose(level: Intensity) {
    setIntensity(level)
    setOpen(false)
    document.documentElement.style.setProperty('--ambient-opacity', String(levels[level]))
    localStorage.setItem('ambient-intensity', level)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Ambient intensity"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold 
                   text-haze-dim hover:text-warm-white transition-colors duration-200
                   border border-transparent hover:border-warm-white/5
                   hover:bg-midnight-light/10"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline capitalize">{intensity}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Menu */}
          <div
            className="absolute right-0 top-full mt-2 z-50 glass-card p-1.5
                       min-w-[120px] animate-scale-in"
          >
            {labels.map((level) => (
              <button
                key={level}
                onClick={() => choose(level)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold
                            capitalize transition-colors duration-150
                            ${intensity === level
                              ? 'bg-ember/10 text-ember border border-ember/20'
                              : 'text-haze-dim hover:text-warm-white hover:bg-midnight-light/15 border border-transparent'
                            }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  level === 'vivid'  ? 'bg-ember' :
                  level === 'subtle' ? 'bg-haze'  : 'bg-haze-dim/30'
                }`} />
                {level}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
