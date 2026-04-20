import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#06060a]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-fuchsia-600/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative">
        {children}
      </div>
    </div>
  )
}
