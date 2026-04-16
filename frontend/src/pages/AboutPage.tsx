import { Link } from 'react-router-dom';
import {
  Sparkles, Heart, Shield, Zap, Users, Globe, Target,
  Rocket, Leaf, Code2, ArrowRight,
} from 'lucide-react';

const values = [
  { icon: <Shield size={22} />, title: 'Privacy first', desc: 'Files auto-deleted. Never shared. Never sold. Ever.', accent: 'from-emerald-500 to-teal-600' },
  { icon: <Zap size={22} />, title: 'Speed over flash', desc: 'Under 2 seconds for most operations. No artificial wait animations.', accent: 'from-amber-500 to-orange-600' },
  { icon: <Heart size={22} />, title: 'Craft in every detail', desc: 'From the tiniest hover state to the biggest conversion engine.', accent: 'from-rose-500 to-pink-600' },
  { icon: <Globe size={22} />, title: 'Free for everyone', desc: 'No paywalls on core tools. No credit card. No silly limits.', accent: 'from-brand-500 to-purple-600' },
];

const milestones = [
  { year: '2024', title: 'The frustration', desc: 'Tired of broken PDF tools with watermarks, ads, and signup walls.' },
  { year: '2025', title: 'First build', desc: 'Merge, split, compress — the three essentials, built right.' },
  { year: '2026', title: '25 tools, zero compromises', desc: 'A lean, quality-first PDF & document suite. Every tool does what it claims — nothing that doesn\'t.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-brand-500/40 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] bg-purple-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Sparkles size={12} className="text-rose-300" /> Our story
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Built because PDFs
            <br />
            <span className="text-gradient">deserved better</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Every "free" PDF site seemed to either plaster watermarks, shove signup walls, or add 3-second artificial loading bars. We built the one we actually wanted to use.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Target size={12} /> Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Document tools that feel like craft
            </h2>
          </div>
          <div className="prose prose-ink max-w-2xl mx-auto text-ink-700 leading-relaxed space-y-4 text-center">
            <p>
              We think document tools should be <strong>fast, private, and honest</strong>. No tracking pixels.
              No 14-day "trials" that silently charge you. No converting a 2-page PDF taking 30 seconds.
            </p>
            <p>
              PDFCraft is 25 hand-picked tools — merge, split, compress, convert, edit, OCR — all
              free, all browser-based, all deleting your files automatically when you're done.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Heart size={12} /> What we believe
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Our values, in four lines
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="group bg-white rounded-2xl p-6 border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${v.accent} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Rocket size={12} /> Timeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              How we got here
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-200 via-purple-200 to-rose-200" />
            {milestones.map((m, idx) => (
              <div key={m.year} className={`relative flex ${idx % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'} mb-10 last:mb-0`}>
                <div className={`relative ml-12 sm:ml-0 sm:w-1/2 ${idx % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:pl-10'}`}>
                  <div className="bg-white rounded-2xl p-5 border border-ink-200 shadow-sm">
                    <div className="text-xs font-bold tabular text-brand-600 mb-1">{m.year}</div>
                    <h3 className="font-bold text-ink-900 mb-1 tracking-tight">{m.title}</h3>
                    <p className="text-sm text-ink-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-4 sm:left-1/2 top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 ring-4 ring-white" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Code2 size={12} /> Tech stack
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              What powers PDFCraft
            </h2>
            <p className="text-ink-500 mt-2">Boring, battle-tested tech. Because your documents are too important for science experiments.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              ['Python', 'PyMuPDF'],
              ['Django', 'REST API'],
              ['React 19', 'Vite'],
              ['TailwindCSS', '4.0'],
              ['python-docx', 'python-pptx'],
              ['openpyxl', 'Pillow'],
              ['Redis', 'Celery'],
              ['PostgreSQL', 'SQLite'],
            ].map(([name, sub]) => (
              <div key={name} className="bg-white rounded-xl border border-ink-200/60 p-4 text-center">
                <div className="font-semibold text-ink-900 text-sm">{name}</div>
                <div className="text-xs text-ink-500 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold rounded-full mb-4">
            <Users size={12} /> Built by humans, for humans
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Thanks for using PDFCraft
          </h2>
          <p className="text-base text-ink-300 max-w-xl mx-auto mb-8 flex items-center justify-center gap-1.5">
            Made with <Leaf size={16} className="text-emerald-400" /> and too much coffee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-ink-900 font-semibold rounded-xl no-underline shadow-2xl shadow-brand-500/30 hover:-translate-y-0.5 transition-all">
              Explore all tools <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/15 no-underline transition-all">
              Say hi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
