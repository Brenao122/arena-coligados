import { LoginFormSimple } from "@/components/auth/login-form-simple"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
              alt="Arena Coligados Logo"
              width={80}
              height={80}
              className="rounded-full ring-2 ring-orange-500/50"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Arena Coligados</h1>
          <p className="text-gray-400">Sistema de Gestão</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <LoginFormSimple />
        </div>
      </div>
    </div>
  )
}
