import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2015%20de%20ago.%20de%202025%2C%2015_13_59-EkQPctn7eQ0XFN7MokBqYnVMruGCyb.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="max-w-md w-full space-y-8 p-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 relative">
            Arena Coligados
            <div className="absolute inset-0 text-orange-500 blur-sm -z-10">Arena Coligados</div>
          </h1>
          <p className="mt-2 text-gray-300 text-lg">Gestão Esportiva</p>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

