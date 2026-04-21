import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-midnight-deep">
      {/* Ambient background — warm editorial */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-blob absolute top-[-25%] left-[-10%] w-[700px] h-[700px] bg-ember/[0.04] rounded-full blur-[140px]" />
        <div className="ambient-blob absolute bottom-[-25%] right-[-10%] w-[550px] h-[550px] bg-midnight-light/[0.07] rounded-full blur-[130px]" style={{ animationDelay: '4s' }} />
        <div className="ambient-blob absolute top-[35%] right-[15%] w-[350px] h-[350px] bg-ember/[0.025] rounded-full blur-[100px]" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative">
        {children}
      </div>
    </div>
  )
}
