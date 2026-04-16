import { Link } from 'react-router-dom';
import {
  Sparkles, Eye, Smartphone, Layers, Shield, Zap, Lock, Globe,
  FileText, Presentation, Image, Minimize2, Merge, Scissors,
  Infinity as InfinityIcon, Clock, Upload, Download, ArrowRight,
  CheckCircle2, Keyboard, Heart, Palette, Code2, Accessibility,
  Languages,
} from 'lucide-react';

interface BigFeature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bullets: string[];
  accent: string;
  badge?: string;
  demoImage?: string;
}

const bigFeatures: BigFeature[] = [
  {
    icon: <Eye size={24} />,
    title: 'Preview before download',
    desc: 'See the exact output — slide thumbnails, compression ratio, page count — before committing to a download. Not right? Change options without re-uploading.',
    bullets: [
      'Full-resolution slide preview with keyboard nav',
      'Sidebar thumbnails for multi-page output',
      'Metadata summary (size, pages, ratio)',
      '"Change options" without re-uploading',
    ],
    accent: 'from-brand-500 to-purple-600',
    badge: 'Unique',
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Scan to mobile via QR',
    desc: 'Generate the file on your desktop, scan a QR code with your phone, and continue on mobile. Perfect for field use, sharing, or when you need the result on the go.',
    bullets: [
      'QR code generated on-the-fly',
      'Share download link with one tap',
      'Works on any device with a camera',
      'Time-limited tokens (15 min) for security',
    ],
    accent: 'from-cyan-500 to-blue-600',
    badge: 'Delightful',
  },
  {
    icon: <Layers size={24} />,
    title: 'Three PDF → PPT modes',
    desc: 'Not all PDF-to-PPT conversions are equal. Pixel-Perfect for visual fidelity, Searchable for Ctrl+F support, Editable for native PowerPoint elements.',
    bullets: [
      'Pixel-Perfect: exact visual rendering',
      'Searchable: invisible text layer for search',
      'Editable: native text, images, shapes',
      'Pick per file — not a one-size-fits-all',
    ],
    accent: 'from-rose-500 to-pink-600',
  },
  {
    icon: <Shield size={24} />,
    title: 'Privacy-first by design',
    desc: 'Files are encrypted in transit and at rest, auto-deleted within 15 minutes of your download expiring. No tracking, no ads, no third-party analytics.',
    bullets: [
      '256-bit SSL encryption end-to-end',
      'Auto-delete within 15 minutes',
      'No third-party tracking',
      'GDPR & CCPA compliant',
    ],
    accent: 'from-emerald-500 to-teal-600',
  },
];

const smallFeatures = [
  { icon: <InfinityIcon size={20} />, title: 'No daily limits',      desc: 'Convert as much as you want.', accent: 'from-emerald-500 to-teal-600' },
  { icon: <Zap size={20} />,          title: 'Sub-second speed',     desc: 'Most operations finish in under 2s.', accent: 'from-amber-500 to-orange-600' },
  { icon: <Lock size={20} />,         title: 'Files auto-deleted',   desc: 'Purged within 15 minutes.', accent: 'from-rose-500 to-pink-600' },
  { icon: <Globe size={20} />,        title: 'Works everywhere',     desc: 'Any browser, any device.', accent: 'from-cyan-500 to-blue-600' },
  { icon: <Keyboard size={20} />,     title: 'Keyboard-first',       desc: 'Ctrl+K search, arrow-key nav.', accent: 'from-brand-500 to-purple-600' },
  { icon: <Heart size={20} />,        title: 'No ads, ever',         desc: 'Your attention is yours.', accent: 'from-pink-500 to-rose-600' },
  { icon: <Palette size={20} />,      title: 'Dark mode ready',      desc: 'Design tokens prepared.', accent: 'from-indigo-500 to-violet-600' },
  { icon: <Code2 size={20} />,        title: 'Open source friendly', desc: 'MIT-licensed components.', accent: 'from-slate-500 to-slate-700' },
  { icon: <Accessibility size={20}/>, title: 'Accessible',           desc: 'WCAG 2.1 AA target.', accent: 'from-teal-500 to-cyan-600' },
  { icon: <Languages size={20} />,    title: 'Multi-language',       desc: 'OCR supports 100+ languages.', accent: 'from-orange-500 to-amber-600' },
  { icon: <Upload size={20} />,       title: '200MB files',          desc: 'Handle huge documents.', accent: 'from-fuchsia-500 to-pink-600' },
  { icon: <Download size={20} />,     title: 'Instant download',     desc: 'No queue, no waiting.', accent: 'from-blue-500 to-indigo-600' },
];

const toolCategories = [
  {
    title: 'PDF operations',
    icon: <FileText size={20} />,
    tools: [
      { name: 'Merge', icon: <Merge size={14} />, href: '/tools/merge' },
      { name: 'Split', icon: <Scissors size={14} />, href: '/tools/split' },
      { name: 'Compress', icon: <Minimize2 size={14} />, href: '/tools/compress' },
      { name: 'Rotate', href: '/tools/rotate' },
      { name: 'Reorder', href: '/tools/reorder' },
      { name: 'Extract', href: '/tools/extract' },
      { name: 'Watermark', href: '/tools/watermark' },
    ],
    accent: 'from-brand-500 to-purple-600',
  },
  {
    title: 'Convert from PDF',
    icon: <Presentation size={20} />,
    tools: [
      { name: 'PDF → Word', href: '/convert/pdf-to-word' },
      { name: 'PDF → Excel', href: '/convert/pdf-to-excel' },
      { name: 'PDF → PPT', href: '/convert/pdf-to-ppt' },
      { name: 'PDF → Image', href: '/convert/pdf-to-image' },
      { name: 'PDF → Text', href: '/convert/pdf-to-text' },
      { name: 'PDF → CSV', href: '/convert/pdf-to-csv' },
    ],
    accent: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Convert to PDF',
    icon: <FileText size={20} />,
    tools: [
      { name: 'Word → PDF', href: '/convert/word-to-pdf' },
      { name: 'Excel → PDF', href: '/convert/excel-to-pdf' },
      { name: 'PPT → PDF', href: '/convert/ppt-to-pdf' },
      { name: 'Image → PDF', href: '/convert/image-to-pdf' },
      { name: 'Text → PDF', href: '/convert/text-to-pdf' },
      { name: 'CSV → PDF', href: '/convert/csv-to-pdf' },
    ],
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Images & OCR',
    icon: <Image size={20} />,
    tools: [
      { name: 'OCR', href: '/convert/ocr' },
      { name: 'Image Converter', href: '/convert/image-format-convert' },
      { name: 'Compress Image', href: '/convert/image-compress' },
      { name: 'Word → Image', href: '/convert/word-to-image' },
      { name: 'Word → Text', href: '/convert/word-to-text' },
    ],
    accent: 'from-amber-500 to-orange-600',
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-brand-500/40 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] bg-purple-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Sparkles size={12} className="text-rose-300" /> Everything PDFCraft can do
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Features that
            <br />
            <span className="text-gradient">actually matter</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            25 tools. 4 flagship features. Zero marketing fluff.
          </p>

          {/* Stats band */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-2xl mx-auto">
            {[
              { value: '25',    label: 'Tools' },
              { value: '15m',   label: 'Auto-delete' },
              { value: '200MB', label: 'Max file' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-extrabold text-white tabular tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</div>
                <div className="text-xs text-ink-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Flagship features — alternating layout */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Sparkles size={12} /> Flagship features
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              What sets us apart
            </h2>
            <p className="text-ink-500 mt-2 max-w-xl mx-auto">Four things we built that most other PDF tools don't have.</p>
          </div>

          <div className="space-y-20">
            {bigFeatures.map((f, idx) => (
              <div
                key={f.title}
                className={`grid md:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                {/* Text */}
                <div>
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-5 bg-gradient-to-br ${f.accent} shadow-pop`}>
                    {f.icon}
                  </div>
                  {f.badge && (
                    <span className="ml-3 align-middle inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-full">
                      {f.badge}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                    {f.title}
                  </h3>
                  <p className="text-ink-600 leading-relaxed mb-6 text-[15px]">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ink-700">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual card */}
                <div className={`relative rounded-3xl p-6 sm:p-10 border border-ink-200 bg-gradient-to-br ${f.accent} overflow-hidden min-h-[280px] flex items-center justify-center shadow-xl`}>
                  <div className="absolute inset-0 bg-grid opacity-20" />
                  <div className="relative text-white opacity-90 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                      <div className="scale-150 opacity-95">{f.icon}</div>
                    </div>
                    <p className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{f.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid — small features */}
      <section className="bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <CheckCircle2 size={12} /> And the basics
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Plus everything you'd expect
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {smallFeatures.map((f) => (
              <div key={f.title} className="group bg-white rounded-2xl p-4 border border-ink-200/60 hover:border-transparent hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white bg-gradient-to-br ${f.accent} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-ink-900 text-sm mb-0.5">{f.title}</h3>
                <p className="text-xs text-ink-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool catalogue */}
      <section className="bg-white border-t border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Zap size={12} /> Full catalogue
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Every tool, organized
            </h2>
            <p className="text-ink-500 mt-2">25 tools across 4 categories — each one picked for quality, not count.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {toolCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-ink-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cat.accent} shadow-md`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {cat.title}
                  </h3>
                  <span className="ml-auto text-xs text-ink-400 tabular">{cat.tools.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.tools.map((t) => (
                    <Link
                      key={t.name}
                      to={t.href}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-ink-50 hover:bg-brand-50 text-ink-700 hover:text-brand-700 rounded-lg no-underline transition-colors"
                    >
                      {t.name} <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Under the hood */}
      <section className="bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Code2 size={12} /> Under the hood
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Built on boring, reliable tech
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Processing', value: 'PyMuPDF + Python', desc: 'Same engine Adobe uses for rendering.' },
              { label: 'Conversions', value: 'python-docx, pptx, openpyxl', desc: 'Industry-standard OOXML libraries.' },
              { label: 'Frontend',   value: 'React 19 + Vite',   desc: 'Fast dev loop, tiny bundles.' },
            ].map((t) => (
              <div key={t.label} className="bg-white rounded-2xl p-6 border border-ink-200">
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-1">{t.label}</p>
                <p className="font-bold text-ink-900 tracking-tight mb-1">{t.value}</p>
                <p className="text-sm text-ink-500">{t.desc}</p>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold rounded-full mb-5">
            <Clock size={12} /> Takes under 30 seconds
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            Try any feature, free
          </h2>
          <p className="text-base text-ink-300 max-w-xl mx-auto mb-8">
            No signup. No credit card. Just drop a file and see it work.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-ink-900 font-semibold rounded-xl no-underline shadow-2xl shadow-brand-500/30 hover:-translate-y-0.5 transition-all">
              Explore all tools <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/compare" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/15 no-underline transition-all">
              Compare with alternatives
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
