"use client"

import { useState } from "react"
import { ArrowRight, Check, ExternalLink, ShieldCheck, Sparkles, X } from "lucide-react"

const salesLink = "https://uswaterrevolution.com/#aff=brenofilm3030"

const benefits = [
  "Aprenda como produzir água usando um sistema simples",
  "Tenha uma alternativa para proteger sua família em períodos de seca",
  "Acesse planos e informações educativas para começar no seu ritmo",
]

export default function HomePageClient() {
  const [activeTab, setActiveTab] = useState("about")
  const [showCookie, setShowCookie] = useState(true)

  return (
    <main className="min-h-screen bg-[#f6f4ee] text-[#18252b]">
      <header className="border-b border-[#d8d3c5] bg-[#102d34] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d9b75c]">Water Revolution</p>
            <p className="mt-1 text-xl font-black tracking-tight">Joseph&apos;s Well</p>
          </div>
          <a href={salesLink} target="_blank" rel="noreferrer" className="hidden items-center rounded-full bg-[#d9b75c] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#102d34] transition hover:bg-white sm:inline-flex">
            Conhecer o produto <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#102d34] px-6 py-20 text-center text-white sm:py-28">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#d9b75c]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#c47755]/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9b75c]/40 bg-[#d9b75c]/10 text-[#d9b75c]"><Sparkles aria-hidden="true" /></div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#d9b75c]">Uma solução para a sua família</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Descubra como ter acesso à sua própria <span className="text-[#d9b75c]">fonte de água</span>.</h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80">A água é essencial. Aprenda como funciona o Joseph&apos;s Well e veja como esse sistema pode ajudar você a se preparar para períodos de escassez.</p>
          <a href={salesLink} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center rounded-full bg-[#d9b75c] px-8 py-4 text-sm font-black uppercase tracking-wider text-[#102d34] shadow-xl transition hover:scale-[1.02] hover:bg-white">Quero conhecer o Joseph&apos;s Well <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a>
          <p className="mt-4 text-xs text-white/55">Clique para assistir à apresentação e ver todos os detalhes.</p>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-[#d8d3c5] bg-[#f6f4ee]/95 px-6 py-3 backdrop-blur" aria-label="Informações do produto">
        <div className="mx-auto flex max-w-4xl justify-center gap-2 sm:gap-8">
          {[['about', 'Sobre o produto'], ['benefits', 'Benefícios'], ['details', 'Detalhes']].map(([value, label]) => (
            <button key={value} onClick={() => setActiveTab(value)} className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition sm:px-6 ${activeTab === value ? 'bg-[#102d34] text-white' : 'text-[#53656a] hover:bg-[#e8e3d7]'}`}>{label}</button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {activeTab === "about" && <div className="space-y-12"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Prepare-se para o futuro</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Água para quando você mais precisar</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-[#53656a]">Joseph&apos;s Well apresenta um método educativo e um conjunto de planos para quem deseja entender uma forma alternativa de obter água em casa.</p></div><div className="grid gap-6 md:grid-cols-3">{benefits.map((benefit, index) => <article key={benefit} className="rounded-3xl border border-[#d8d3c5] bg-white p-7 shadow-sm"><span className="text-4xl font-black text-[#d9b75c]">0{index + 1}</span><p className="mt-5 text-lg font-bold leading-7">{benefit}</p></article>)}</div><div className="rounded-3xl bg-[#e8e3d7] p-8 text-center sm:p-10"><ShieldCheck className="mx-auto text-[#c47755]" aria-hidden="true" /><h3 className="mt-4 text-2xl font-black">Veja como funciona antes de decidir</h3><p className="mx-auto mt-3 max-w-2xl leading-7 text-[#53656a]">Assista à apresentação completa para conhecer o sistema, entender o que está incluído e descobrir se ele faz sentido para a sua casa.</p><a href={salesLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center rounded-full bg-[#102d34] px-7 py-3 font-black text-white transition hover:bg-[#c47755]">Assistir à apresentação <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div>}

        {activeTab === "benefits" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Por que conhecer</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Mais autonomia para sua família</h2></div><div className="space-y-4">{benefits.map((benefit) => <div key={benefit} className="flex gap-4 rounded-2xl border border-[#d8d3c5] bg-white p-6 shadow-sm"><Check className="mt-1 shrink-0 text-[#c47755]" aria-hidden="true" /><p className="font-bold leading-7">{benefit}</p></div>)}</div><div className="mt-10 text-center"><a href={salesLink} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-[#c47755] px-8 py-4 font-black text-white hover:bg-[#102d34]">Quero saber mais <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div>}

        {activeTab === "details" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Informações importantes</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Conheça todos os detalhes</h2></div><div className="space-y-6 rounded-3xl border border-[#d8d3c5] bg-white p-7 leading-8 text-[#53656a] sm:p-10"><p>Joseph&apos;s Well oferece informações educativas e planos DIY para ajudar você a compreender uma alternativa de produção de água. Os resultados podem variar conforme o local, a instalação e as condições de cada pessoa.</p><p>Siga as regulamentações locais e consulte profissionais qualificados quando necessário. A apresentação oficial explica o conteúdo, o funcionamento e as condições da oferta.</p><div className="pt-3 text-center"><a href={salesLink} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-[#102d34] px-7 py-3 font-black text-white hover:bg-[#c47755]">Ver a oferta oficial <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div></div>}
      </section>

      <footer className="border-t border-[#d8d3c5] bg-[#102d34] px-6 py-12 text-center text-white/70"><p className="font-black text-white">Joseph&apos;s Well</p><p className="mt-3 text-sm">Informações educativas para uma vida mais preparada.</p><div className="mt-5 flex justify-center gap-5 text-xs font-bold uppercase tracking-wide"><a href={salesLink} target="_blank" rel="noreferrer" className="hover:text-white">Termos</a><a href={salesLink} target="_blank" rel="noreferrer" className="hover:text-white">Privacidade</a></div></footer>

      {showCookie && <div className="fixed bottom-5 left-5 right-5 z-30 flex items-center justify-between gap-4 rounded-2xl border border-[#d8d3c5] bg-white p-4 shadow-2xl sm:left-auto sm:max-w-md"><p className="text-sm leading-5 text-[#53656a]">Usamos cookies para melhorar sua experiência. <a href={salesLink} target="_blank" rel="noreferrer" className="font-bold text-[#c47755] underline">Saiba mais</a></p><button onClick={() => setShowCookie(false)} aria-label="Fechar aviso de cookies" className="rounded-full p-2 text-[#53656a] hover:bg-[#e8e3d7]"><X className="h-4 w-4" aria-hidden="true" /></button></div>}
    </main>
  )
}
