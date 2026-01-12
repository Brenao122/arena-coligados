"use client"

import { Instagram, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InstagramSection() {
  const profiles = [
    {
      name: "ARENA COLIGADOS",
      handle: "@arenacoligados",
      followers: "4.277 seguidores",
      posts: "248 posts",
      url: "https://instagram.com/arenacoligados",
      isActive: true,
    },
    {
      name: "COMPLEXO COLIGADOS",
      handle: "@complexoarenacoligados",
      followers: "Em breve",
      posts: "Em breve",
      url: "#",
      isActive: false,
    },
  ]

  return (
    <section className="relative min-h-screen py-20 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/whatsapp-20image-202025-08-11-20at-2022.jpeg"
          alt="Beach sports background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase mb-4 tracking-tight">
            VIVA A EXPERIÊNCIA
          </h2>
          <p className="text-lg md:text-xl text-white/90 font-medium">Momentos que viram memórias</p>
        </div>

        {/* Instagram Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {profiles.map((profile) => (
            <div
              key={profile.handle}
              className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              {/* Logo with Instagram Badge */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <img src="/logo.png" alt="Arena Coligados Logo" className="w-full h-full rounded-full" />
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full p-2">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase text-center mb-2">
                {profile.name}
              </h3>
              <p className="text-[#FF6B47] font-bold text-center mb-4">{profile.handle}</p>
              <p className="text-gray-600 text-sm text-center mb-6">
                {profile.followers} · {profile.posts}
              </p>

              {/* Follow Button */}
              <a href={profile.url} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-gradient-to-r from-[#FF6B47] to-[#FF8566] hover:from-[#FF5A35] hover:to-[#FF7555] text-white font-bold py-6 rounded-full uppercase tracking-wide transition-all duration-300">
                  <Instagram className="h-5 w-5 mr-2" />
                  SEGUIR
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase mb-8 tracking-tight">
            FAÇA PARTE DA FAMÍLIA COLIGADOS!
          </h3>
          <a href="https://instagram.com/arenacoligados" target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-[#FF6B47] to-[#FF8566] hover:from-[#FF5A35] hover:to-[#FF7555] text-white font-bold px-8 py-6 rounded-full uppercase tracking-wide text-lg shadow-2xl hover:scale-105 transition-all duration-300">
              <Instagram className="h-6 w-6 mr-2" />
              VER PERFIL NO INSTAGRAM
              <ExternalLink className="h-5 w-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
