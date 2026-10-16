"use client"

import { useState } from "react"
import { ArrowRight, Check, ExternalLink, ShieldCheck, X } from "lucide-react"

const salesLink = "https://checkout-ds24.com/redir/615548/brenofilm3030"

const benefits = [
  "Reprogram your subconscious mind for greater confidence on the phone",
  "Replace cold-calling anxiety with clarity, energy, and determination",
  "Use practical scripts, rituals, and mindset resets before every call",
]

const ebookItems = [
  "Neuro-performance techniques to change your inner dialogue",
  "The high-performing pre-call ritual for entering a confident flow state",
  "The 3-second mindset reset to start calls with conviction",
  "Psychological reframes that turn rejection into fuel for growth",
  "Natural scripts and talking points for confident conversations",
  "Your personalized Fearless Call Blueprint for lasting progress",
]

export default function HomePageClient() {
  const [activeTab, setActiveTab] = useState("about")
  const [showCookie, setShowCookie] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#211b1b]">
      <header className="border-b border-[#dfd4c8] bg-[#211b1b] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e8b86a]">Fearless Phone Fanatic</p>
            <p className="mt-1 text-xl font-black tracking-tight">Mind Programming for Sales Confidence</p>
          </div>
          <button type="button" onClick={() => setShowCheckout(true)} className="hidden items-center rounded-full bg-[#e8b86a] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#211b1b] transition hover:bg-white sm:inline-flex">Get Instant Access <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#211b1b] px-6 py-20 text-center text-white sm:py-28">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#e8b86a]/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#a9483f]/25 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#e8b86a]">Stop fearing the phone</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Turn cold calling anxiety into <span className="text-[#e8b86a]">confidence.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80">Just listen, relax, and let the Fearless Phone Fanatic audio help reprogram the subconscious beliefs holding your sales performance back.</p>
          <button type="button" onClick={() => setShowCheckout(true)} className="mt-9 inline-flex items-center rounded-full bg-[#e8b86a] px-8 py-4 text-sm font-black uppercase tracking-wider text-[#211b1b] shadow-xl transition hover:scale-[1.02] hover:bg-white">Access Fearless Phone Fanatic <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></button>
          <p className="mt-4 text-xs text-white/55">Get the audio, eBook, and cheat sheet through the members area.</p>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-[#dfd4c8] bg-[#f8f5ef]/95 px-6 py-3 backdrop-blur" aria-label="Product information">
        <div className="mx-auto flex max-w-4xl justify-center gap-2 sm:gap-8">
          {[['about', 'The product'], ['benefits', 'What you get'], ['details', 'Details']].map(([value, label]) => <button key={value} type="button" onClick={() => setActiveTab(value)} className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition sm:px-6 ${activeTab === value ? 'bg-[#211b1b] text-white' : 'text-[#6c5b55] hover:bg-[#eee5dc]'}`}>{label}</button>)}
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {activeTab === "about" && <div className="space-y-12"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#a9483f]">A calmer, stronger sales mindset</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">What if cold calling felt easy?</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6c5b55]">Your subconscious mind can replay negative beliefs about cold calling. This program is designed to support a new mental pattern of confidence, focus, and action.</p></div><div className="grid gap-6 md:grid-cols-3">{benefits.map((benefit, index) => <article key={benefit} className="rounded-3xl border border-[#dfd4c8] bg-white p-7 shadow-sm"><span className="text-4xl font-black text-[#e8b86a]">0{index + 1}</span><p className="mt-5 text-lg font-bold leading-7">{benefit}</p></article>)}</div><div className="rounded-3xl bg-[#eee5dc] p-8 text-center sm:p-10"><ShieldCheck className="mx-auto text-[#a9483f]" aria-hidden="true" /><h3 className="mt-4 text-2xl font-black">Listen, relax, and build a fearless mindset</h3><p className="mx-auto mt-3 max-w-2xl leading-7 text-[#6c5b55]">Most users notice increased confidence in a week or two. The recommended program is designed for 30 days of use.</p><button type="button" onClick={() => setShowCheckout(true)} className="mt-6 inline-flex items-center rounded-full bg-[#211b1b] px-7 py-3 font-black text-white transition hover:bg-[#a9483f]">See the full offer <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></button></div></div>}

        {activeTab === "benefits" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#a9483f]">Included with your access</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Three tools to change your calls</h2></div><div className="space-y-4">{['Fearless Phone Fanatic audio program', 'eBook: More Strategies to Overcome Cold Calling Anxiety', 'The Fearless Phone Fanatic Cheat Sheet'].map((item) => <div key={item} className="flex gap-4 rounded-2xl border border-[#dfd4c8] bg-white p-6 shadow-sm"><Check className="mt-1 shrink-0 text-[#a9483f]" aria-hidden="true" /><p className="font-bold leading-7">{item}</p></div>)}</div><div className="mt-10 rounded-3xl border border-[#dfd4c8] bg-white p-7"><h3 className="text-2xl font-black">Inside the eBook</h3><ul className="mt-5 space-y-3 text-[#6c5b55]">{ebookItems.map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#a9483f]" aria-hidden="true" />{item}</li>)}</ul></div><div className="mt-10 text-center"><button type="button" onClick={() => setShowCheckout(true)} className="inline-flex items-center rounded-full bg-[#a9483f] px-8 py-4 font-black text-white hover:bg-[#211b1b]">Get instant access <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></button></div></div>}

        {activeTab === "details" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#a9483f]">Simple and low risk</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Start for only $59</h2></div><div className="space-y-6 rounded-3xl border border-[#dfd4c8] bg-white p-7 leading-8 text-[#6c5b55] sm:p-10"><p>Upon purchase, you will be immediately transferred to a download page containing all three products available for download.</p><p>Your purchase is processed securely by Digistore24 and includes a 60-day money-back guarantee.</p><p>The program is a personal development tool designed to support mindset change through subliminal programming. Results vary from person to person. Users should be 18 or older and consult a medical professional if they have concerns about mental health.</p><div className="pt-3 text-center"><button type="button" onClick={() => setShowCheckout(true)} className="inline-flex items-center rounded-full bg-[#211b1b] px-7 py-3 font-black text-white hover:bg-[#a9483f]">View the official offer <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></button></div></div></div>}
      </section>

      <footer className="border-t border-[#dfd4c8] bg-[#211b1b] px-6 py-12 text-center text-white/70"><div className="mx-auto max-w-5xl"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zDicaSm4HJH3n4qywWwz94Xxky3JeK.png" alt="60 Day Money Back Guarantee" className="mx-auto mb-8 w-44 object-contain" /><h2 className="text-xl font-black text-white">60 Day Money-Back Guarantee</h2><p className="mx-auto mt-2 max-w-4xl text-sm leading-6">If, for any reason, you are not satisfied with your product within 60 days of purchase, just locate the receipt/invoice sent to your email after purchase and follow the steps to request a refund.</p><div className="mx-auto mt-8 max-w-5xl text-left text-xs leading-5"><h3 className="text-center font-black text-white">Disclaimer</h3><p className="mt-2">The methods used in Fearless Phone Fanatic have been extremely effective in helping people make the transformations that they desired, however, results may vary from person to person. The Fearless Phone Fanatic audio program is a personal development tool designed to support mindset change through subliminal programming.</p><ul className="mt-2 list-disc space-y-1 pl-5"><li>You are solely responsible for how you interpret and apply the content.</li><li>The creators, owners, and distributors of this program are not liable for any outcomes, perceived lack of results, or interpretations of the program&apos;s effect.</li><li>This product is intended for adults 18 and older. Consult a medical professional if you have concerns about mental health.</li></ul></div><p className="mt-10 text-lg font-black text-white">© 2025 Fearless Phone Fanatic. All rights reserved.</p><p className="mt-2 text-sm">FearlessPhoneFanatic.store is a U.S.-based business. Unauthorized use of any content or materials on this site is strictly prohibited.</p><div className="mt-5 flex justify-center gap-5 text-xs font-bold uppercase tracking-wide"><a href={salesLink} target="_blank" rel="noreferrer" className="hover:text-white">Privacy Policy</a><a href={salesLink} target="_blank" rel="noreferrer" className="hover:text-white">Terms and conditions</a></div></div></footer>

      {showCookie && <div className="fixed bottom-5 left-5 right-5 z-30 flex items-center justify-between gap-4 rounded-2xl border border-[#dfd4c8] bg-white p-4 shadow-2xl sm:left-auto sm:max-w-md"><p className="text-sm leading-5 text-[#6c5b55]">We use cookies to improve your experience. <a href={salesLink} target="_blank" rel="noreferrer" className="font-bold text-[#a9483f] underline">Learn more</a></p><button type="button" onClick={() => { window.location.assign(salesLink) }} aria-label="Accept cookies and continue" className="rounded-full p-2 text-[#6c5b55] hover:bg-[#eee5dc]"><X className="h-4 w-4" aria-hidden="true" /></button></div>}

      {showCheckout && <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#211b1b]/75 px-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div className="relative w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10"><button type="button" onClick={() => setShowCheckout(false)} aria-label="Close checkout popup" className="absolute right-4 top-4 rounded-full p-2 text-[#6c5b55] hover:bg-[#eee5dc]"><X className="h-5 w-5" aria-hidden="true" /></button><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#a9483f]">Fearless Phone Fanatic</p><h2 id="checkout-title" className="mt-3 text-3xl font-black text-[#211b1b]">Ready to become fearless?</h2><p className="mt-4 leading-7 text-[#6c5b55]">Continue to the official offer to get instant access to the audio, eBook, and cheat sheet.</p><p className="mt-4 text-2xl font-black text-[#a9483f]">Today only $59</p><a href={salesLink} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center rounded-full bg-[#e8b86a] px-8 py-4 font-black text-[#211b1b] transition hover:bg-[#211b1b] hover:text-white">Go to checkout <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div>}
    </main>
  )
}
