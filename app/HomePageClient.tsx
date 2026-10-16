"use client"

import { useState } from "react"
import { ArrowRight, Check, ExternalLink, ShieldCheck, Sparkles, X } from "lucide-react"

const salesLink = "https://uswaterrevolution.com/#aff=brenofilm3030"

const benefits = [
  "Learn how to produce water with a simple, practical system",
  "Discover an alternative way to prepare and protect your family",
  "Get access to clear plans and educational guidance to get started",
]

export default function HomePageClient() {
  const [activeTab, setActiveTab] = useState("about")
  const [showCookie, setShowCookie] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <main className="min-h-screen bg-[#f6f4ee] text-[#18252b]">
      <header className="border-b border-[#d8d3c5] bg-[#102d34] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d9b75c]">Water Revolution</p>
            <p className="mt-1 text-xl font-black tracking-tight">Joseph&apos;s Well</p>
          </div>
          <a href={salesLink} target="_blank" rel="noreferrer" className="hidden items-center rounded-full bg-[#d9b75c] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#102d34] transition hover:bg-white sm:inline-flex">
            Explore the product <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#102d34] px-6 py-20 text-center text-white sm:py-28">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#d9b75c]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#c47755]/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9b75c]/40 bg-[#d9b75c]/10 text-[#d9b75c]"><Sparkles aria-hidden="true" /></div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#d9b75c]">A smarter solution for your family</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Discover how to access your own <span className="text-[#d9b75c]">source of water</span>.</h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80">Water is essential. Learn how Joseph&apos;s Well works and see how this system can help you prepare for uncertain times.</p>
          <button type="button" onClick={() => setShowCheckout(true)} className="mt-9 inline-flex items-center rounded-full bg-[#d9b75c] px-8 py-4 text-sm font-black uppercase tracking-wider text-[#102d34] shadow-xl transition hover:scale-[1.02] hover:bg-white">I want to learn about Joseph&apos;s Well <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></button>
          <p className="mt-4 text-xs text-white/55">Click to watch the presentation and see all the details.</p>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-[#d8d3c5] bg-[#f6f4ee]/95 px-6 py-3 backdrop-blur" aria-label="Product information">
        <div className="mx-auto flex max-w-4xl justify-center gap-2 sm:gap-8">
          {[['about', 'About the product'], ['benefits', 'Benefits'], ['details', 'Details']].map(([value, label]) => (
            <button key={value} onClick={() => setActiveTab(value)} className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition sm:px-6 ${activeTab === value ? 'bg-[#102d34] text-white' : 'text-[#53656a] hover:bg-[#e8e3d7]'}`}>{label}</button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {activeTab === "about" && <div className="space-y-12"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Prepare for the future</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Water when you need it most</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-[#53656a]">Joseph&apos;s Well provides educational guidance and practical plans for anyone who wants to understand an alternative way to access water at home.</p></div><div className="grid gap-6 md:grid-cols-3">{benefits.map((benefit, index) => <article key={benefit} className="rounded-3xl border border-[#d8d3c5] bg-white p-7 shadow-sm"><span className="text-4xl font-black text-[#d9b75c]">0{index + 1}</span><p className="mt-5 text-lg font-bold leading-7">{benefit}</p></article>)}</div><div className="rounded-3xl bg-[#e8e3d7] p-8 text-center sm:p-10"><ShieldCheck className="mx-auto text-[#c47755]" aria-hidden="true" /><h3 className="mt-4 text-2xl font-black">See how it works before you decide</h3><p className="mx-auto mt-3 max-w-2xl leading-7 text-[#53656a]">Watch the full presentation to understand the system, see what is included, and decide if it is right for your home.</p><a href={salesLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center rounded-full bg-[#102d34] px-7 py-3 font-black text-white transition hover:bg-[#c47755]">Watch the presentation <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div>}

        {activeTab === "benefits" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Why explore it</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">More independence for your family</h2></div><div className="space-y-4">{benefits.map((benefit) => <div key={benefit} className="flex gap-4 rounded-2xl border border-[#d8d3c5] bg-white p-6 shadow-sm"><Check className="mt-1 shrink-0 text-[#c47755]" aria-hidden="true" /><p className="font-bold leading-7">{benefit}</p></div>)}</div><div className="mt-10 text-center"><a href={salesLink} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-[#c47755] px-8 py-4 font-black text-white hover:bg-[#102d34]">I want to learn more <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div>}

        {activeTab === "details" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Important information</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Explore all the details</h2></div><div className="space-y-6 rounded-3xl border border-[#d8d3c5] bg-white p-7 leading-8 text-[#53656a] sm:p-10"><p>Joseph&apos;s Well offers educational information and DIY plans to help you understand an alternative way to produce water. Results may vary depending on location, installation, and individual conditions.</p><p>Follow local regulations and consult qualified professionals when needed. The official presentation explains the content, how it works, and the offer terms.</p><div className="pt-3 text-center"><a href={salesLink} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-[#102d34] px-7 py-3 font-black text-white hover:bg-[#c47755]">View the official offer <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div></div>}
      </section>

      <footer className="border-t border-[#d8d3c5] bg-[#102d34] px-6 py-12 text-center text-white/70"><p className="font-black text-white">Joseph&apos;s Well</p><p className="mt-3 text-sm">Educational information for a more prepared life.</p><div className="mt-5 flex justify-center gap-5 text-xs font-bold uppercase tracking-wide"><a href={salesLink} target="_blank" rel="noreferrer" className="hover:text-white">Terms</a><a href={salesLink} target="_blank" rel="noreferrer" className="hover:text-white">Privacy</a></div></footer>

      {showCookie && <div className="fixed bottom-5 left-5 right-5 z-30 flex items-center justify-between gap-4 rounded-2xl border border-[#d8d3c5] bg-white p-4 shadow-2xl sm:left-auto sm:max-w-md"><p className="text-sm leading-5 text-[#53656a]">We use cookies to improve your experience. <a href={salesLink} target="_blank" rel="noreferrer" className="font-bold text-[#c47755] underline">Learn more</a></p><button onClick={() => setShowCookie(false)} aria-label="Close cookie notice" className="rounded-full p-2 text-[#53656a] hover:bg-[#e8e3d7]"><X className="h-4 w-4" aria-hidden="true" /></button></div>}

      {showCheckout && <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#102d34]/75 px-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div className="relative w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10"><button type="button" onClick={() => setShowCheckout(false)} aria-label="Close checkout popup" className="absolute right-4 top-4 rounded-full p-2 text-[#53656a] hover:bg-[#e8e3d7]"><X className="h-5 w-5" aria-hidden="true" /></button><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Joseph&apos;s Well</p><h2 id="checkout-title" className="mt-3 text-3xl font-black text-[#102d34]">Ready to get started?</h2><p className="mt-4 leading-7 text-[#53656a]">Continue to the official checkout page to see the offer and complete your purchase.</p><a href={salesLink} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center rounded-full bg-[#d9b75c] px-8 py-4 font-black text-[#102d34] transition hover:bg-[#102d34] hover:text-white">Go to checkout <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div>}
    </main>
  )
}
