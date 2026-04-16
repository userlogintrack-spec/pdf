import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, MessageCircle, Send, CheckCircle2, Sparkles,
  Clock, MapPin, Shield, ArrowRight,
} from 'lucide-react';

const reasons = [
  { value: 'support',  label: 'Technical support' },
  { value: 'bug',      label: 'Report a bug' },
  { value: 'feature',  label: 'Feature request' },
  { value: 'privacy',  label: 'Privacy / GDPR request' },
  { value: 'billing',  label: 'Billing question' },
  { value: 'business', label: 'Partnership / business' },
  { value: 'other',    label: 'Something else' },
];

export default function ContactPage() {
  const [reason, setReason] = useState('support');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Local-only for now — a real /contact endpoint can be added later.
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-brand-500/40 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] bg-purple-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Sparkles size={12} className="text-rose-300" /> Let's talk
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Get in <span className="text-gradient">touch</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Bug reports, feature requests, privacy questions, business deals — we read every message.
          </p>
        </div>
      </section>

      <section className="bg-white border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            {/* Form */}
            <div className="order-2 lg:order-1">
              {sent ? (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-2xl p-10 text-center animate-scale-in">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-ink-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    Message received
                  </h2>
                  <p className="text-ink-600 mb-6 max-w-md mx-auto">
                    We'll get back within 48 hours — usually much sooner. If it's urgent, email us directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-ink-200 text-ink-700 rounded-xl font-semibold hover:border-brand-300 hover:text-brand-700 transition-all cursor-pointer"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8 shadow-sm">
                  <h2 className="font-bold text-ink-900 text-xl mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    Send a message
                  </h2>
                  <p className="text-sm text-ink-500 mb-6">Fields marked with * are required.</p>

                  <label className="block mb-4">
                    <span className="block text-sm font-semibold text-ink-700 mb-1.5">What's this about? *</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {reasons.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setReason(r.value)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                            reason === r.value
                              ? 'border-transparent bg-gradient-to-br from-brand-50 to-purple-50/60 ring-2 ring-brand-500/30 text-brand-700'
                              : 'border-ink-200 hover:border-ink-300 text-ink-600 bg-white'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </label>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <label className="block">
                      <span className="block text-sm font-semibold text-ink-700 mb-1.5">Name</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-semibold text-ink-700 mb-1.5">Email *</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                      />
                    </label>
                  </div>

                  <label className="block mb-6">
                    <span className="block text-sm font-semibold text-ink-700 mb-1.5">Message *</span>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's on your mind? The more specific, the faster we can help."
                      className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-y"
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                    <p className="text-xs text-ink-400 flex items-center gap-1.5">
                      <Shield size={12} /> Your email stays private.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting || !email || !message}
                      className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 cursor-pointer transition-all"
                    >
                      {submitting ? 'Sending…' : (<><Send size={16} /> Send message</>)}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right sidebar */}
            <aside className="order-1 lg:order-2 space-y-4">
              <div className="bg-gradient-to-br from-ink-50 to-brand-50/20 rounded-2xl p-6 border border-ink-100">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-md">
                  <Mail size={20} />
                </div>
                <h3 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Email us</h3>
                <p className="text-sm text-ink-500 mb-3">
                  Prefer email? Drop us a line directly.
                </p>
                <a href="mailto:hello@pdfcraft.app" className="inline-flex items-center gap-1.5 text-brand-700 font-semibold text-sm no-underline hover:underline">
                  hello@pdfcraft.app <ArrowRight size={14} />
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-ink-200">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-md">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Response time</h3>
                <p className="text-sm text-ink-500">
                  Usually within 24 hours (Mon–Fri).
                  Urgent privacy / security issues: within 4 hours.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-ink-200">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mb-4 shadow-md">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Where we are</h3>
                <p className="text-sm text-ink-500">
                  A remote-first team, mostly India + Europe.
                  We speak English, हिंदी, and just enough emoji 👋.
                </p>
              </div>

              <Link to="/" className="block bg-ink-950 text-white rounded-2xl p-6 hover:bg-ink-900 transition-colors no-underline group">
                <MessageCircle size={20} className="mb-3 text-brand-300" />
                <p className="text-sm font-semibold mb-1">Not sure what you need?</p>
                <p className="text-xs text-ink-400 mb-3">Browse all 25 tools — maybe we already built it.</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:translate-x-0.5 transition-transform">
                  See all tools <ArrowRight size={12} />
                </span>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
