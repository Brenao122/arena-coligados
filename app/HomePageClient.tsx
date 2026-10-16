"use client"

import { useState } from "react"
import { ExternalLink, Mail, ShieldCheck, Sparkles, Video, X } from "lucide-react"

const affiliateLink = "https://uswaterrevolution.com/#aff=brenofilm3030"

const emails = [
  {
    title: "Email 1",
    subject: "[URGENT] The Bible warned us… now it’s happening",
    body: `Our Lord warned us this day would come… but we didn’t listen...

“And He will shut up the heavens so that it will not rain.” — Deut. 11:17

Now, for many, it is too late!

The rivers are drying…
The wells are empty…

And America is running out of water.

But one man—guided by prayer—built a simple system… A God-given way to provide water when nothing else will.

Watch this before it’s too late.

— [Your Name]`,
  },
  {
    title: "Email 2",
    subject: "[URGENT] All true Christians need to see this…",
    body: `Farmers know it. NASA confirmed it.

But Scripture warned us first:

“I will command the clouds not to rain on it.” — Isaiah 5:6

America is running out of water. We’ve entered the days of famine and thirst.

But this video shows the quiet solution one believer built to protect his family.

Watch now before it’s too late.

– [Your Name]`,
  },
  {
    title: "Email 3",
    subject: "[URGENT] This Prophecy Is Unfolding—And Most Christians Aren’t Ready",
    body: `Farmers saw it coming. Now NASA confirms it: the drought is real.

But the first warning came from Scripture:

“I will command the clouds not to rain on it.” — Isaiah 5:6

We’re not just facing a water shortage.

We’re living through the beginning of the great drought—just as the Bible foretold.

But one faithful man didn’t wait for disaster.

He built a simple device to shield his family from thirst—no wells, no filters, no grid.

This short video shows exactly how he did it.
You need to see this before it’s taken down.

[Watch the video now]

[Your Name]`,
  },
]

export default function HomePageClient() {
  const [activeTab, setActiveTab] = useState("start")
  const [showCookie, setShowCookie] = useState(true)

  return (
    <main className="min-h-screen bg-[#f6f4ee] text-[#18252b]">
      <header className="border-b border-[#d8d3c5] bg-[#102d34] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d9b75c]">Affiliate Resources</p>
            <p className="mt-1 text-xl font-black tracking-tight">Joseph&apos;s Well</p>
          </div>
          <a href={affiliateLink} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#d9b75c] px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-[#102d34] transition hover:bg-white sm:inline-flex">
            Get Your Link <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#102d34] px-6 py-20 text-center text-white sm:py-28">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#d9b75c]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#c47755]/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9b75c]/40 bg-[#d9b75c]/10 text-[#d9b75c]"><Sparkles aria-hidden="true" /></div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#d9b75c]">Joseph&apos;s Well</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Promote now and get up to <span className="text-[#d9b75c]">$197 per sale</span>.</h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/80">Our affiliates are seeing 5%+ conversion rates and over $2 EPCs on ice-cold traffic.</p>
          <p className="mx-auto mt-4 max-w-2xl font-semibold text-white/95">Huge EPCs. Fully optimized for insane cold traffic performance—with proven creatives provided.</p>
          <a href={affiliateLink} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center rounded-full bg-[#d9b75c] px-8 py-4 text-sm font-black uppercase tracking-wider text-[#102d34] shadow-xl transition hover:scale-[1.02] hover:bg-white">Get Your Affiliate Link <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a>
        </div>
      </section>

      <nav className="sticky top-0 z-20 border-b border-[#d8d3c5] bg-[#f6f4ee]/95 px-6 py-3 backdrop-blur" aria-label="Affiliate resources">
        <div className="mx-auto flex max-w-4xl justify-center gap-2 sm:gap-8">
          {[["start", "Get started"], ["creatives", "Emails & creatives"], ["terms", "Terms"]].map(([value, label]) => (
            <button key={value} onClick={() => setActiveTab(value)} className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition sm:px-6 ${activeTab === value ? "bg-[#102d34] text-white" : "text-[#53656a] hover:bg-[#e8e3d7]"}`}>{label}</button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        {activeTab === "start" && <div className="space-y-12">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Everything you need</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Start promoting in 3 easy steps</h2></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[["01", "Your free DigiStore24 account", "If you don’t have a DigiStore24 account, visit this link to create one for free."], ["02", "Your affiliate link", "For email traffic, we highly recommend sending in the morning. For even better results, send again the next day with a different creative."], ["03", "Get your creatives", "Download the creatives and whitelisted images below, then start promoting while following the affiliate terms."]].map(([number, title, text]) => <article key={number} className="rounded-3xl border border-[#d8d3c5] bg-white p-7 shadow-sm"><span className="text-4xl font-black text-[#d9b75c]">{number}</span><h3 className="mt-5 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#53656a]">{text}</p>{number === "02" && <a href={affiliateLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex font-extrabold text-[#c47755] hover:underline">GET YOUR LINK <ExternalLink className="ml-2 h-4 w-4" /></a>}</article>)}
          </div>
          <div className="rounded-3xl bg-[#e8e3d7] p-8"><h3 className="flex items-center gap-3 text-xl font-black"><ShieldCheck className="text-[#c47755]" aria-hidden="true" />Traffic guidelines</h3><p className="mt-4 leading-8 text-[#53656a]">You can promote Joseph&apos;s Well on social and search channels, with one restriction: brand bidding is not allowed. Do not bid on “Joseph&apos;s Well”, “Joseph&apos;s Well review” or similar terms. Email traffic must be opt-in.</p></div>
        </div>}

        {activeTab === "creatives" && <div><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Proven creatives</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Email swipes</h2><p className="mx-auto mt-4 max-w-2xl text-[#53656a]">Use these ideas as a starting point for your campaigns and adapt them to your audience.</p></div><div className="space-y-6">{emails.map((email) => <article key={email.title} className="rounded-3xl border border-[#d8d3c5] bg-white p-7 shadow-sm sm:p-9"><div className="flex items-center gap-3 text-[#c47755]"><Mail className="h-5 w-5" aria-hidden="true" /><p className="text-sm font-extrabold uppercase tracking-widest">{email.title}</p></div><h3 className="mt-5 text-xl font-black">Subject: {email.subject}</h3><pre className="mt-6 whitespace-pre-wrap font-sans text-[15px] leading-8 text-[#53656a]">{email.body}</pre></article>)}</div><div className="mt-8 rounded-3xl bg-[#102d34] p-8 text-center text-white"><Video className="mx-auto text-[#d9b75c]" aria-hidden="true" /><p className="mt-4 font-bold">Click to download banners and approved images</p><a href={affiliateLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[#d9b75c] px-6 py-3 text-sm font-black text-[#102d34]">ACCESS MATERIALS</a></div></div>}

        {activeTab === "terms" && <div className="mx-auto max-w-3xl"><div className="mb-12 text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c47755]">Affiliate terms</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Keep it clean and compliant</h2></div><div className="space-y-8 rounded-3xl border border-[#d8d3c5] bg-white p-7 leading-8 text-[#53656a] sm:p-10"><p className="font-bold text-[#18252b]">By promoting our products, you agree to follow these guidelines.</p><div><h3 className="font-black text-[#18252b]">The basics</h3><p>No misleading claims, impersonation, spam, or unauthorized use of our website and videos. Affiliates must comply with the FTC Act, CAN-SPAM Act, and applicable consumer protection laws.</p></div><div><h3 className="font-black text-[#18252b]">What is not allowed</h3><p>Do not bid on brand keywords, copy content from our site, sell products on retail or auction sites, create unauthorized freebies, issue press releases, or represent yourself as the product owner.</p></div><div><h3 className="font-black text-[#18252b]">Disclaimer</h3><p>Results may vary. Joseph&apos;s Well provides educational information and DIY plans and does not guarantee specific income or health outcomes. Always follow local regulations and consult qualified professionals when needed.</p></div></div></div>}
      </section>

      <footer className="border-t border-[#d8d3c5] bg-[#102d34] px-6 py-12 text-center text-white/70"><p className="font-black text-white">Joseph&apos;s Well</p><p className="mt-3 text-sm">© 2023 Digistore24 Inc. and/or its licensors.</p><div className="mt-5 flex justify-center gap-5 text-xs font-bold uppercase tracking-wide"><a href={affiliateLink} target="_blank" rel="noreferrer" className="hover:text-white">Terms</a><a href={affiliateLink} target="_blank" rel="noreferrer" className="hover:text-white">Privacy</a><a href={affiliateLink} target="_blank" rel="noreferrer" className="hover:text-white">Affiliates</a></div></footer>

      {showCookie && <div className="fixed bottom-5 left-5 right-5 z-30 flex items-center justify-between gap-4 rounded-2xl border border-[#d8d3c5] bg-white p-4 shadow-2xl sm:left-auto sm:max-w-md"><p className="text-sm leading-5 text-[#53656a]">We use cookies to improve your experience. <a href={affiliateLink} target="_blank" rel="noreferrer" className="font-bold text-[#c47755] underline">Learn more</a></p><button onClick={() => setShowCookie(false)} aria-label="Fechar aviso de cookies" className="rounded-full p-2 text-[#53656a] hover:bg-[#e8e3d7]"><X className="h-4 w-4" aria-hidden="true" /></button></div>}
    </main>
  )
}
