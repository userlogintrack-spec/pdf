import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, UserCheck, Ban, Scale, Mail, ArrowRight } from 'lucide-react';

const sections: { id: string; title: string; icon: React.ReactNode; body: React.ReactNode }[] = [
  {
    id: 'acceptance',
    title: 'Acceptance',
    icon: <CheckCircle2 size={18} />,
    body: (
      <>
        <p>
          By using PDFCraft (the "Service"), you agree to these Terms. If you don't agree, please don't use the Service.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    title: 'Acceptable use',
    icon: <UserCheck size={18} />,
    body: (
      <>
        <p>You agree to use PDFCraft only for lawful purposes. You will not:</p>
        <ul>
          <li>Upload content that is illegal, infringing, or violates third-party rights.</li>
          <li>Process files containing malware or exploits.</li>
          <li>Attempt to overload, hack, or reverse-engineer the Service.</li>
          <li>Use automated scripts to bypass rate limits or abuse free-tier quotas.</li>
          <li>Resell or redistribute PDFCraft output under a different brand without permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'content',
    title: 'Your content',
    icon: <FileText size={18} />,
    body: (
      <>
        <p>
          You retain full ownership of any file you upload. You grant us a limited, short-lived license
          only to process your files to deliver the requested conversion — nothing more, nothing longer.
        </p>
        <p>
          Files are auto-deleted within 24 hours. See our{' '}
          <Link to="/privacy" className="text-brand-600 hover:text-brand-700 font-medium no-underline">Privacy Policy</Link>{' '}
          for details.
        </p>
      </>
    ),
  },
  {
    id: 'availability',
    title: 'Availability',
    icon: <AlertTriangle size={18} />,
    body: (
      <>
        <p>
          We aim for 99.9% uptime but don't guarantee uninterrupted service. The Service is provided
          "as is" without warranties. We may modify, suspend, or discontinue features at any time,
          with reasonable notice for breaking changes.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Limits of liability',
    icon: <Scale size={18} />,
    body: (
      <>
        <p>
          To the maximum extent permitted by law, PDFCraft is not liable for indirect or consequential
          damages, including lost data, lost profits, or business interruption. <strong>Always keep a
          backup of your original files before running any conversion.</strong>
        </p>
        <p>
          Our total liability for any claim is capped at the amount you paid us in the last 12 months
          (which is zero for free-tier users).
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Termination',
    icon: <Ban size={18} />,
    body: (
      <>
        <p>
          We may suspend or terminate access if you violate these Terms. You can stop using
          the Service and delete your account at any time — all your data goes within 7 days.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to terms',
    icon: <FileText size={18} />,
    body: (
      <>
        <p>
          We may update these Terms as the Service evolves. Material changes will be notified 14 days in advance
          via email (if you have an account) or a banner on the site. Continued use after the notice period
          constitutes acceptance.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: <Mail size={18} />,
    body: (
      <>
        <p>
          Questions about these Terms?{' '}
          <Link to="/contact" className="text-brand-600 hover:text-brand-700 font-medium no-underline">Reach out</Link>{' '}
          — we'll get back within 48 hours.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-amber-500/25 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Scale size={12} className="text-amber-300" /> The ground rules
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Plain English. No 60-page lawyer soup. Just the essentials.
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
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
            Need clarification?
          </h3>
          <p className="text-sm text-ink-500 mb-6">
            Terms should be clear, not confusing. Ask us anything.
          </p>
          <Link to="/contact" className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl no-underline shadow-pop hover:shadow-glow hover:-translate-y-0.5 transition-all">
            Contact us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
