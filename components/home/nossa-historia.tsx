"use client"

import { Users, Trophy, Heart, Calendar } from 'lucide-react'

export function NossaHistoria() {
  return (
    <section className="relative z-10">
      {/* Header with decorative elements */}
      <div className="text-center mb-12 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD966]/10 rounded-full blur-3xl -z-10" />
        <h2 className="text-instagram-title text-gray-900 mb-4 uppercase">Nossa História</h2>
        <div className="flex items-center justify-center gap-4 text-[#FF6B47] font-black uppercase tracking-wider">
          <Heart className="h-6 w-6 fill-current" aria-hidden="true" />
          <span className="text-lg text-gray-900">Arena Coligados é FAMÍLIA</span>
          <Heart className="h-6 w-6 fill-current" aria-hidden="true" />
        </div>
      </div>

      {/* Main story card */}
      <div className="card-instagram relative overflow-hidden mb-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FFD966]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FF6B47]/10 rounded-full blur-3xl" />
        
        <div className="p-10 md:p-14 relative z-10">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-900 leading-relaxed mb-6 font-medium text-lg">
              O nome <strong className="text-[#FF6B47] font-black">Coligados</strong> nasceu de um grupo de amigos que se conhecem
              desde 2011. Mesmo com o passar dos anos, as mudanças da vida, o trabalho e a chegada dos filhos, esse grupo
              continua unido, mantendo viva a amizade que os conecta. Sempre que possível, estão juntos — em viagens,
              encontros e, claro, nos campos e quadras.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6 font-medium">
              Desse vínculo surgiu também um time de futebol amador que se tornou referência na várzea goiana, acumulando
              conquistas e reforçando o espírito de união que caracteriza os Coligados.
            </p>

            <p className="text-gray-900 leading-relaxed mb-6 font-medium">
              Inspirados por essa trajetória de parceria, amizade e respeito, os irmãos{" "}
              <strong className="text-[#FF6B47] font-black">Gustavo Oliveira</strong> e{" "}
              <strong className="text-[#FF6B47] font-black">Rafael Henrique</strong> — integrantes do grupo desde o início —
              decidiram levar esse conceito além da convivência pessoal. Assim nasceu a{" "}
              <strong className="text-[#FF6B47] font-black">Arena Coligados</strong>, um espaço pensado para celebrar o esporte, a
              convivência e a amizade.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6 font-medium">
              Desde então, a Família Coligados só cresce. Hoje, contamos com uma equipe formada por cerca de 12
              colaboradores e centenas de clientes que se tornaram verdadeiros amigos.
            </p>

            <p className="text-gray-900 leading-relaxed mb-6 font-medium">
              Com a primeira unidade inaugurada no <strong className="text-[#FF6B47] font-black">Parque Amazônia</strong>, a Arena
              rapidamente se consolidou e, em menos de dois anos, expandiu suas atividades para uma segunda unidade,
              localizada no <strong className="text-[#FF6B47] font-black">Setor Vila Rosa</strong>. E essa é apenas parte da nossa
              história — porque, com fé em Deus e o mesmo espírito que nos une desde o início, ainda vem muita novidade
              por aí.
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10" role="list">
        <article className="section-coral relative overflow-hidden group" role="listitem">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFD966] rounded-full opacity-30 blur-3xl group-hover:scale-110 transition-transform" />
          <Users className="h-14 w-14 text-white mb-4 relative z-10" aria-hidden="true" />
          <h3 className="text-2xl font-black text-white mb-2 uppercase relative z-10">Fundadores</h3>
          <p className="text-white/90 font-bold text-sm uppercase tracking-wide relative z-10">Gustavo & Rafael</p>
        </article>

        <article className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-[2rem] p-8 relative overflow-hidden group" role="listitem">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFD966] rounded-full opacity-30 blur-3xl group-hover:scale-110 transition-transform" />
          <Trophy className="h-14 w-14 text-white mb-4 relative z-10" aria-hidden="true" />
          <h3 className="text-2xl font-black text-white mb-2 uppercase relative z-10">Time</h3>
          <p className="text-white/90 font-bold text-sm uppercase tracking-wide relative z-10">12 Colaboradores</p>
        </article>

        <article className="bg-gradient-to-br from-[#FFD966] to-yellow-500 text-white rounded-[2rem] p-8 relative overflow-hidden group" role="listitem">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FF6B47] rounded-full opacity-30 blur-3xl group-hover:scale-110 transition-transform" />
          <Calendar className="h-14 w-14 text-white mb-4 relative z-10" aria-hidden="true" />
          <h3 className="text-2xl font-black text-white mb-2 uppercase relative z-10">Desde</h3>
          <p className="text-white/90 font-bold text-sm uppercase tracking-wide relative z-10">2011</p>
        </article>
      </div>

      {/* Final quote */}
      <div className="section-coral-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD966]/30 rounded-full blur-3xl" />
        <p className="text-gray-900 text-xl md:text-2xl font-black leading-relaxed text-center relative z-10 uppercase">
          Em pouco tempo, a Arena conquistou seu espaço e consolidou uma comunidade fiel de atletas e amigos,
          mantendo vivo o propósito que nos originou: ser mais que uma arena esportiva — ser um ponto de encontro
          entre pessoas e valores.
        </p>
      </div>
    </section>
  )
}
