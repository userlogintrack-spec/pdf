import { Link } from 'react-router-dom';
import {
  Check, X, Minus, Sparkles, ArrowRight, Shield, Zap, Eye,
  Layers, Lock, Globe, Infinity as InfinityIcon, Smartphone,
} from 'lucide-react';

type Support = 'yes' | 'no' | 'limited';

interface Feature {
  label: string;
  description?: string;
  pdfcraft: Support;
  ilovepdf: Support;
  smallpdf: Support;
  adobe: Support;
  note?: string;
}

const features: Feature[] = [
  { label: 'Free unlimited conversions',  description: 'No daily task limit', pdfcraft: 'yes',     ilovepdf: 'limited', smallpdf: 'limited', adobe: 'no' },
  { label: 'No signup required',           description: 'Process files instantly', pdfcraft: 'yes', ilovepdf: 'limited', smallpdf: 'limited', adobe: 'no' },
  { label: 'Preview before download',      description: 'See the output first',    pdfcraft: 'yes', ilovepdf: 'no',      smallpdf: 'no',      adobe: 'limited' },
  { label: 'PDF to PPT (3 modes)',         description: 'Pixel-Perfect + Searchable + Editable', pdfcraft: 'yes', ilovepdf: 'limited', smallpdf: 'limited', adobe: 'yes' },
  { label: 'Scan to mobile via QR',        description: 'Continue on your phone', pdfcraft: 'yes', ilovepdf: 'no', smallpdf: 'no', adobe: 'no' },
  { label: '25+ tools in one place',       pdfcraft: 'yes', ilovepdf: 'yes',     smallpdf: 'yes',     adobe: 'limited' },
  { label: 'Files auto-deleted',           description: 'Cleared within minutes', pdfcraft: 'yes', ilovepdf: 'yes', smallpdf: 'yes', adobe: 'yes' },
  { label: 'No watermarks on output',      pdfcraft: 'yes', ilovepdf: 'yes',     smallpdf: 'limited', adobe: 'yes' },
  { label: 'Bulk / batch processing',      description: 'Multiple files at once', pdfcraft: 'limited', ilovepdf: 'yes', smallpdf: 'yes', adobe: 'yes' },
  { label: 'Open source / self-hostable',  pdfcraft: 'yes', ilovepdf: 'no',      smallpdf: 'no',      adobe: 'no' },
  { label: 'Indian payment support',       description: 'Razorpay / UPI / Cashfree', pdfcraft: 'yes', ilovepdf: 'no', smallpdf: 'no', adobe: 'no' },
  { label: 'Mobile-optimized UI',          pdfcraft: 'yes', ilovepdf: 'yes', smallpdf: 'yes', adobe: 'yes' },
  { label: 'No ads',                       pdfcraft: 'yes', ilovepdf: 'no', smallpdf: 'limited', adobe: 'yes' },
];

function SupportCell({ status }: { status: Support }) {
  if (status === 'yes')
    return (
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-600">
        <Check size={16} strokeWidth={3} />
      </div>
    );
  if (status === 'limited')
    return (
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600" title="Limited">
        <Minus size={16} strokeWidth={3} />
      </div>
    );
  return (
    <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink-100 text-ink-400">
      <X size={16} strokeWidth={3} />
    </div>
  );
}

const providers = [
  { key: 'pdfcraft', name: 'PDFCraft', accent: 'from-brand-500 to-purple-600', bg: 'bg-gradient-to-br from-brand-50 to-purple-50/50', text: 'text-brand-700', highlight: true },
  { key: 'ilovepdf', name: 'iLovePDF', accent: 'from-rose-400 to-red-500', bg: 'bg-white', text: 'text-ink-700', highlight: false },
  { key: 'smallpdf', name: 'SmallPDF', accent: 'from-amber-400 to-orange-500', bg: 'bg-white', text: 'text-ink-700', highlight: false },
  { key: 'adobe',    name: 'Adobe',    accent: 'from-red-500 to-red-700',    bg: 'bg-white', text: 'text-ink-700', highlight: false },
] as const;

export default function ComparePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-brand-500/40 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] bg-purple-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Sparkles size={12} className="text-rose-300" /> Side-by-side comparison
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            PDFCraft <span className="text-gradient">vs the rest</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            See exactly how we stack up against iLovePDF, SmallPDF, and Adobe Acrobat — no marketing spin.
          </p>
        </div>
      </section>

      {/* Quick wins — why PDFCraft */}
      <section className="bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              What makes PDFCraft different
            </h2>
            <p className="text-ink-500 mt-2">Features you won't find in most alternatives</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Eye size={22} />, title: 'Preview before download', desc: 'Every tool shows you the exact output with thumbnails. Not happy? Tweak options without re-uploading.', accent: 'from-brand-500 to-purple-600' },
              { icon: <Smartphone size={22} />, title: 'Continue on mobile', desc: 'Every download generates a QR code — scan with your phone to get the file on another device.', accent: 'from-cyan-500 to-blue-600' },
              { icon: <Layers size={22} />, title: '3 PPT modes', desc: 'Pixel-Perfect, Searchable (OCR layer), or Fully Editable. Most tools give you only one option.', accent: 'from-rose-500 to-pink-600' },
              { icon: <InfinityIcon size={22} />, title: 'No daily limits', desc: 'Convert, compress, merge as much as you want. No "3 tasks per hour" nonsense.', accent: 'from-emerald-500 to-teal-600' },
              { icon: <Lock size={22} />, title: 'Files auto-deleted', desc: 'Preview tokens expire in 15 min and files get purged — your data never lingers.', accent: 'from-amber-500 to-orange-600' },
              { icon: <Zap size={22} />, title: 'No signup walls', desc: 'Drop a file, download the result. No "sign up to continue" popups halfway.', accent: 'from-fuchsia-500 to-pink-600' },
            ].map((b) => (
              <div key={b.title} className="group bg-white rounded-2xl p-6 border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${b.accent} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  {b.icon}
                </div>
                <h3 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{b.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Feature comparison
            </h2>
            <p className="text-ink-500 mt-2">
              <span className="inline-flex items-center gap-1 mr-4"><Check size={14} className="text-emerald-500" /> Full support</span>
              <span className="inline-flex items-center gap-1 mr-4"><Minus size={14} className="text-amber-500" /> Limited</span>
              <span className="inline-flex items-center gap-1"><X size={14} className="text-ink-400" /> Not available</span>
            </p>
          </div>

          <div className="rounded-2xl border border-ink-200 overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ink-50/60 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold text-ink-700 text-sm min-w-[240px]">Feature</th>
                    {providers.map((p) => (
                      <th key={p.key} className={`px-5 py-4 font-semibold text-sm ${p.highlight ? 'bg-gradient-to-br from-brand-50 to-purple-50/50' : ''}`}>
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${p.accent}`} />
                          <span className={p.highlight ? 'text-brand-700' : 'text-ink-700'}>{p.name}</span>
                          {p.highlight && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={f.label} className={`border-t border-ink-100 ${i % 2 === 0 ? '' : 'bg-ink-50/30'}`}>
                      <td className="px-5 py-4">
                        <div className="font-medium text-ink-900 text-sm">{f.label}</div>
                        {f.description && <div className="text-xs text-ink-500 mt-0.5">{f.description}</div>}
                      </td>
                      {providers.map((p) => (
                        <td key={p.key} className={`px-5 py-4 text-center ${p.highlight ? 'bg-gradient-to-br from-brand-50/40 to-purple-50/30' : ''}`}>
                          <SupportCell status={f[p.key as keyof Feature] as Support} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-ink-400 mt-4 text-center">
            Comparisons based on publicly available free-tier information as of April 2026. Feature parity changes — check each provider for their latest.
          </p>
        </div>
      </section>

      {/* Honest section — where we're not the best */}
      <section className="bg-ink-50/50 border-t border-ink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-3">
              Being honest
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              When other tools might fit better
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Adobe Acrobat', desc: 'If you need industry-standard compliance, complex form workflows, or enterprise DRM.' },
              { title: 'iLovePDF', desc: 'If you want iOS/Android apps, or need very large batch operations right now.' },
              { title: 'SmallPDF', desc: 'If you use their eSign / workflow features, or prefer their mobile app.' },
            ].map((x) => (
              <div key={x.title} className="bg-white rounded-2xl p-5 border border-ink-200">
                <h3 className="font-semibold text-ink-900 mb-1">{x.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{x.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink-500 text-center mt-8 max-w-xl mx-auto">
            We'd rather lose you to the right tool than keep you on the wrong one.
          </p>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Shield size={20} />, label: '256-bit SSL', desc: 'Files encrypted in transit' },
              { icon: <Lock size={20} />, label: 'Auto-deleted', desc: 'Purged in 15 minutes' },
              { icon: <Globe size={20} />, label: 'GDPR ready', desc: 'EU privacy compliant' },
              { icon: <Zap size={20} />, label: 'Sub-second', desc: 'For files under 5MB' },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center mb-2 shadow-md">{t.icon}</div>
                <div className="font-bold text-ink-900 text-sm">{t.label}</div>
                <div className="text-xs text-ink-500">{t.desc}</div>
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Try PDFCraft free
          </h2>
          <p className="text-base text-ink-300 max-w-xl mx-auto mb-8">
            No credit card. No signup. Just drop a file and download the result in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-ink-900 font-semibold rounded-xl no-underline shadow-2xl shadow-brand-500/30 hover:-translate-y-0.5 transition-all"
            >
              Explore all tools
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/15 no-underline transition-all"
            >
              Open PDF Editor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
