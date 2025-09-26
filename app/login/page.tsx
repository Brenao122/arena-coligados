import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.5px)] bg-[length:20px_20px]"></div>

      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-green-500/10"></div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-md w-full space-y-8 p-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-green-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-11%20at%2022.27.16-0QPOwwmNw3jfubVRs8DJkiW87DX0AW.jpeg"
                alt="Arena Coligados Logo"
                width={120}
                height={120}
                className="relative rounded-full ring-4 ring-orange-500/50 shadow-2xl"
              />
            </div>
          </div>

          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
              Arena Coligados
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-medium">Gestão Esportiva</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
