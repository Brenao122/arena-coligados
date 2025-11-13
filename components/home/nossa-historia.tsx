"use client"

import { Users, Trophy, Heart } from "lucide-react"

export function NossaHistoria() {
  return (
    <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-orange-400 mb-4">Nossa História</h2>
          <div className="flex items-center justify-center gap-4 text-orange-300">
            <Heart className="h-6 w-6" />
            <span className="text-lg">Arena Coligados é FAMÍLIA</span>
            <Heart className="h-6 w-6" />
          </div>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-gray-100 leading-relaxed mb-6">
            O nome <strong className="text-orange-300">Coligados</strong> nasceu de um grupo de amigos que se conhecem
            desde 2011. Mesmo com o passar dos anos, as mudanças da vida, o trabalho e a chegada dos filhos, esse grupo
            continua unido, mantendo viva a amizade que os conecta. Sempre que possível, estão juntos — em viagens,
            encontros e, claro, nos campos e quadras.
          </p>

          <p className="text-gray-100 leading-relaxed mb-6">
            Desse vínculo surgiu também um time de futebol amador que se tornou referência na várzea goiana, acumulando
            conquistas e reforçando o espírito de união que caracteriza os Coligados.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-6 text-center">
              <Users className="h-12 w-12 text-orange-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Fundadores</h3>
              <p className="text-gray-200">Gustavo Oliveira e Rafael Henrique</p>
            </div>
            <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-6 text-center">
              <Trophy className="h-12 w-12 text-orange-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Time</h3>
              <p className="text-gray-200">12 colaboradores e centenas de clientes-amigos</p>
            </div>
          </div>

          <p className="text-gray-100 leading-relaxed mb-6">
            Inspirados por essa trajetória de parceria, amizade e respeito, os irmãos{" "}
            <strong className="text-orange-300">Gustavo Oliveira</strong> e{" "}
            <strong className="text-orange-300">Rafael Henrique</strong> — integrantes do grupo desde o início —
            decidiram levar esse conceito além da convivência pessoal. Assim nasceu a{" "}
            <strong className="text-orange-300">Arena Coligados</strong>, um espaço pensado para celebrar o esporte, a
            convivência e a amizade.
          </p>

          <p className="text-gray-100 leading-relaxed mb-6">
            Desde então, a Família Coligados só cresce. Hoje, contamos com uma equipe formada por cerca de 12
            colaboradores e centenas de clientes que se tornaram verdadeiros amigos.
          </p>

          <p className="text-gray-100 leading-relaxed mb-6">
            Com a primeira unidade inaugurada no <strong className="text-orange-300">Parque Amazônia</strong>, a Arena
            rapidamente se consolidou e, em menos de dois anos, expandiu suas atividades para uma segunda unidade,
            localizada no <strong className="text-orange-300">Setor Vila Rosa</strong>. E essa é apenas parte da nossa
            história — porque, com fé em Deus e o mesmo espírito que nos une desde o início, ainda vem muita novidade
            por aí.
          </p>

          <div className="bg-gradient-to-r from-orange-500/30 to-orange-600/30 border-l-4 border-orange-400 rounded-lg p-6 mt-8">
            <p className="text-white text-xl font-semibold leading-relaxed">
              Em pouco tempo, a Arena conquistou seu espaço e consolidou uma comunidade fiel de atletas e amigos,
              mantendo vivo o propósito que nos originou: ser mais que uma arena esportiva — ser um ponto de encontro
              entre pessoas e valores.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
