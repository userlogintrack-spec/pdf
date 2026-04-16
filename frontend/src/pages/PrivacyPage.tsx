import { Link } from 'react-router-dom';
import { Shield, Lock, Trash2, Eye, Mail, Cookie, Globe, ArrowRight } from 'lucide-react';

const sections: { id: string; title: string; icon: React.ReactNode; body: React.ReactNode }[] = [
  {
    id: 'collection',
    title: 'What we collect',
    icon: <Eye size={18} />,
    body: (
      <>
        <p>When you use PDFCraft, we receive only what's strictly needed to process your request:</p>
        <ul>
          <li><strong>Files you upload</strong> — stored temporarily for processing (see retention below).</li>
          <li><strong>Account info</strong> (if you register) — email + password hash only.</li>
          <li><strong>Anonymous usage stats</strong> — tool name + success/failure, never file contents.</li>
          <li><strong>Basic request metadata</strong> — IP (for rate-limiting), user-agent, request time.</li>
        </ul>
        <p>We do <strong>not</strong> use tracking pixels, third-party analytics, or ad networks.</p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep files',
    icon: <Trash2 size={18} />,
    body: (
      <>
        <ul>
          <li><strong>Uploaded files</strong> — auto-deleted 24 hours after upload, or 15 minutes after your download token expires, whichever comes first.</li>
          <li><strong>Preview/output files</strong> — purged within 15 minutes of generation.</li>
          <li><strong>Account data</strong> — retained while your account is active. Delete your account anytime and everything goes within 7 days.</li>
        </ul>
        <p>A nightly cleanup job sweeps orphaned files. No manual action needed.</p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share with',
    icon: <Lock size={18} />,
    body: (
      <>
        <p><strong>Nobody.</strong> We do not sell, rent, or share your files or personal data with any third party. Period.</p>
        <p>The only exception is lawful requests from authorities — and even then we can only hand over metadata (we can't produce files that have already been auto-deleted).</p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    icon: <Cookie size={18} />,
    body: (
      <>
        <p>We use only essential cookies:</p>
        <ul>
          <li><strong>Session</strong> — keeps your current tool state.</li>
          <li><strong>Auth tokens</strong> (if logged in) — keeps you signed in via secure, HttpOnly cookies.</li>
        </ul>
        <p>No marketing, analytics, or fingerprinting cookies.</p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'How we protect data',
    icon: <Shield size={18} />,
    body: (
      <>
        <ul>
          <li>TLS 1.3 encryption for every request (256-bit SSL).</li>
          <li>Files stored on encrypted volumes (at-rest encryption).</li>
          <li>Per-user session isolation — your files are never visible to other users.</li>
          <li>Regular dependency updates + automated security scanning.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights (GDPR / CCPA)',
    icon: <Globe size={18} />,
    body: (
      <>
        <p>You can at any time:</p>
        <ul>
          <li><strong>Access</strong> all personal data we hold (request via email).</li>
          <li><strong>Delete</strong> your account and all associated data.</li>
          <li><strong>Export</strong> your data in JSON.</li>
          <li><strong>Object</strong> to processing or withdraw consent.</li>
        </ul>
        <p>We respond within 30 days, usually within 48 hours.</p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    icon: <Mail size={18} />,
    body: (
      <>
        <p>
          Privacy concern, question, or request?{' '}
          <Link to="/contact" className="text-brand-600 hover:text-brand-700 font-medium no-underline">Get in touch</Link>{' '}
          — we read every message.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-teal-500/25 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Shield size={12} className="text-emerald-300" /> Your privacy, guaranteed
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Plain-language privacy policy. Short, specific, and actually followed.
          </p>
          <p className="text-xs text-ink-400 mt-4 tabular">Last updated: 2026-04-17</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          {/* TOC */}
          <aside className="hidden md:block">
            <div className="sticky top-24 space-y-1">
              <div className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-3 px-2">Jump to</div>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-ink-600 hover:text-brand-700 hover:bg-brand-50 rounded-md no-underline transition-colors"
                >
                  <span className="text-ink-400">{s.icon}</span>
                  <span>{s.title}</span>
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <article className="space-y-12 prose prose-ink max-w-none">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                    {s.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-ink-900 tracking-tight m-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {s.title}
                  </h2>
                </div>
                <div className="text-ink-700 leading-relaxed space-y-3 text-[15px] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-ink-900">
                  {s.body}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h3 className="text-xl font-bold text-ink-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Questions about your data?
          </h3>
          <p className="text-sm text-ink-500 mb-6">
            Email us directly, we personally read every message.
          </p>
          <Link to="/contact" className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl no-underline shadow-pop hover:shadow-glow hover:-translate-y-0.5 transition-all">
            Contact us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
