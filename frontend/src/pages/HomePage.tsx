import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Merge, Scissors, RotateCw, ArrowDownUp,
  FileOutput, Minimize2, Droplets, Lock,
  FileType, FileSpreadsheet, Image, ScanSearch,
  Shield, Zap, Globe, ArrowRight, Sparkles,
  Presentation, Table, FileUp, ImageDown,
  FileText, Star, CheckCircle2, Users, MousePointer2,
  TrendingUp, Flame, HelpCircle, ChevronDown,
} from 'lucide-react';

type Tool = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  accent: string;
};

const pdfTools: Tool[] = [
  { icon: <Merge size={22} />, title: 'Merge PDF', desc: 'Combine PDFs into one', href: '/tools/merge', accent: 'from-blue-500 to-blue-600' },
  { icon: <Scissors size={22} />, title: 'Split PDF', desc: 'Split into files', href: '/tools/split', accent: 'from-emerald-500 to-emerald-600' },
  { icon: <Minimize2 size={22} />, title: 'Compress', desc: 'Reduce file size', href: '/tools/compress', accent: 'from-pink-500 to-rose-600' },
  { icon: <RotateCw size={22} />, title: 'Rotate', desc: 'Rotate pages', href: '/tools/rotate', accent: 'from-orange-500 to-orange-600' },
  { icon: <ArrowDownUp size={22} />, title: 'Reorder', desc: 'Rearrange pages', href: '/tools/reorder', accent: 'from-violet-500 to-purple-600' },
  { icon: <FileOutput size={22} />, title: 'Extract', desc: 'Extract pages', href: '/tools/extract', accent: 'from-teal-500 to-cyan-600' },
  { icon: <Droplets size={22} />, title: 'Watermark', desc: 'Add watermark', href: '/tools/watermark', accent: 'from-cyan-500 to-sky-600' },
  { icon: <ScanSearch size={22} />, title: 'OCR', desc: 'Recognize scanned text', href: '/convert/ocr', accent: 'from-slate-500 to-slate-700' },
];

const pdfConversions: Tool[] = [
  { icon: <FileType size={22} />, title: 'PDF to Word', desc: 'Convert to DOCX', href: '/convert/pdf-to-word', accent: 'from-blue-600 to-indigo-700' },
  { icon: <FileSpreadsheet size={22} />, title: 'PDF to Excel', desc: 'Convert to XLSX', href: '/convert/pdf-to-excel', accent: 'from-green-600 to-emerald-700' },
  { icon: <Presentation size={22} />, title: 'PDF to PPT', desc: 'PowerPoint ready', href: '/convert/pdf-to-ppt', accent: 'from-rose-500 to-pink-600' },
  { icon: <Image size={22} />, title: 'PDF to Image', desc: 'PNG / JPEG', href: '/convert/pdf-to-image', accent: 'from-purple-500 to-fuchsia-600' },
  { icon: <FileText size={22} />, title: 'PDF to Text', desc: 'Extract plain text', href: '/convert/pdf-to-text', accent: 'from-slate-500 to-slate-700' },
  { icon: <Table size={22} />, title: 'PDF to CSV', desc: 'Extract tables', href: '/convert/pdf-to-csv', accent: 'from-emerald-600 to-teal-700' },
];

const toPdfConversions: Tool[] = [
  { icon: <FileUp size={22} />, title: 'Word to PDF', desc: 'DOCX to PDF', href: '/convert/word-to-pdf', accent: 'from-blue-500 to-blue-600' },
  { icon: <FileUp size={22} />, title: 'Excel to PDF', desc: 'XLSX to PDF', href: '/convert/excel-to-pdf', accent: 'from-green-500 to-emerald-600' },
  { icon: <FileUp size={22} />, title: 'PPT to PDF', desc: 'Slides to PDF', href: '/convert/ppt-to-pdf', accent: 'from-rose-500 to-pink-600' },
  { icon: <FileUp size={22} />, title: 'Image to PDF', desc: 'PNG / JPG to PDF', href: '/convert/image-to-pdf', accent: 'from-purple-500 to-violet-600' },
  { icon: <FileUp size={22} />, title: 'Text to PDF', desc: 'TXT to PDF', href: '/convert/text-to-pdf', accent: 'from-slate-500 to-slate-700' },
  { icon: <FileUp size={22} />, title: 'CSV to PDF', desc: 'Tables to PDF', href: '/convert/csv-to-pdf', accent: 'from-emerald-500 to-teal-600' },
];

const wordConversions: Tool[] = [
  { icon: <ImageDown size={22} />, title: 'Word to Image', desc: 'DOCX to PNG/JPEG', href: '/convert/word-to-image', accent: 'from-violet-500 to-purple-600' },
  { icon: <FileText size={22} />, title: 'Word to Text', desc: 'DOCX to TXT', href: '/convert/word-to-text', accent: 'from-slate-500 to-slate-700' },
];

const imageTools: Tool[] = [
  { icon: <Image size={22} />, title: 'Image Converter', desc: 'PNG · JPG · WebP · GIF', href: '/convert/image-format-convert', accent: 'from-fuchsia-500 to-pink-600' },
  { icon: <Minimize2 size={22} />, title: 'Compress Image', desc: 'Reduce image size', href: '/convert/image-compress', accent: 'from-pink-500 to-rose-600' },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to={tool.href}
      className="group relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-white border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all duration-300 no-underline overflow-hidden"
    >
      {/* Hover gradient border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))',
        }}
      />

      <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${tool.accent} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
        {tool.icon}
      </div>
      <div className="relative">
        <div className="text-sm font-semibold text-ink-900 group-hover:text-brand-700 transition-colors">{tool.title}</div>
        <div className="text-xs text-ink-500 mt-0.5">{tool.desc}</div>
      </div>

      {/* Arrow on hover */}
      <ArrowRight size={14} className="absolute top-5 right-5 text-ink-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function ToolGrid({ tools, title, subtitle }: { tools: Tool[]; title: string; subtitle?: string }) {
  return (
    <div className="mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
          {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="hidden sm:block text-xs text-ink-400 tabular">
          {tools.length} tool{tools.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl sm:text-4xl font-extrabold text-ink-900 tabular tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
      <div className="text-sm text-ink-500 mt-1">{label}</div>
    </div>
  );
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'Is PDFCraft really free?',
    a: 'Yes. All core tools — merge, split, compress, and every PDF↔Office conversion — are free with no signup required. Files up to 10MB process instantly. Larger files (up to 200MB) require a free account to cover server costs.',
  },
  {
    q: 'Are my files secure?',
    a: 'Absolutely. Files are encrypted in transit (256-bit SSL) and at rest, auto-deleted 15 minutes after your download token expires, and never shared with third parties. We are GDPR compliant.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. PDFCraft runs entirely in your browser — Chrome, Safari, Firefox, Edge, mobile or desktop. No plugins, no downloads, no hassle.',
  },
  {
    q: 'What is the difference between Pixel-Perfect, Searchable, and Editable PDF-to-PPT modes?',
    a: 'Pixel-Perfect renders each page as a high-res image (looks exactly like the PDF). Searchable adds invisible text on top for Ctrl+F support. Editable extracts text, images, and shapes as native PowerPoint elements you can click and edit individually.',
  },
  {
    q: 'Why use the Preview step before downloading?',
    a: 'You see exactly what you will get before committing. If it is not right, click "Change options" to adjust mode, quality, or pages without re-uploading — saves time and bandwidth.',
  },
  {
    q: 'Can I use PDFCraft on my phone?',
    a: 'Yes. The full site works on mobile, and every preview modal has a "Get on phone" button that generates a QR code — scan it to download the file on a different device.',
  },
  {
    q: 'What file formats are supported?',
    a: 'PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), Image (PNG/JPG/WebP/GIF/BMP/TIFF), HTML, TXT, and CSV. All major formats for document workflows.',
  },
  {
    q: 'Is there an API?',
    a: 'A public API is on our roadmap. Drop us a note if you have a specific use case — we prioritize features based on demand.',
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${open ? 'border-brand-300 bg-gradient-to-br from-brand-50/30 to-purple-50/20 shadow-sm' : 'border-ink-200 bg-white hover:border-ink-300'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start gap-3 p-5 text-left cursor-pointer"
      >
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${open ? 'bg-gradient-to-br from-brand-500 to-purple-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
          <HelpCircle size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-ink-900 text-[15px] leading-snug">{q}</div>
          <div
            className="grid transition-all duration-300 ease-out"
            style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-ink-600 leading-relaxed pt-2">{a}</p>
            </div>
          </div>
        </div>
        <ChevronDown size={18} className={`shrink-0 mt-1.5 text-ink-400 transition-transform ${open ? 'rotate-180 text-brand-600' : ''}`} />
      </button>
    </div>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="relative bg-gradient-to-b from-ink-50/60 to-white border-t border-ink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
            <HelpCircle size={12} /> Questions answered
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            Frequently asked
          </h2>
          <p className="text-ink-500 mt-2">
            Short, no-fluff answers. Still stuck?{' '}
            <Link to="/compare" className="text-brand-600 hover:text-brand-700 font-medium no-underline">See how we compare</Link>.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FAQItem
              key={i}
              q={f.q}
              a={f.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* ===== Hero ===== */}
      <section className="relative bg-aurora bg-white overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 backdrop-blur-md border border-ink-200/60 text-ink-700 text-xs font-semibold rounded-full mb-6 shadow-soft animate-scale-in">
              <Sparkles size={12} className="text-brand-600" />
              <span>Free online PDF & document suite</span>
              <span className="w-px h-3 bg-ink-300 mx-0.5" />
              <span className="text-brand-600">25 tools</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}
            >
              <span className="text-gradient-ink">Every tool you need</span>
              <br />
              <span className="text-gradient">to work with documents</span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Merge, split, compress, and convert PDFs. Transform Word, Excel, PowerPoint, and images — fast, secure, and gorgeous.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <Link
                to="/editor"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 via-brand-600 to-purple-600 text-white font-semibold rounded-xl no-underline shadow-pop hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Open PDF Editor</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                {/* Sheen */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-[shimmer_1s_linear] opacity-0 group-hover:opacity-100" />
                </div>
              </Link>
              <Link
                to="/tools/merge"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/70 backdrop-blur-md text-ink-700 font-semibold rounded-xl border border-ink-200/70 hover:border-brand-300 hover:text-brand-700 hover:shadow-md no-underline transition-all"
              >
                Merge PDFs
              </Link>
              <Link
                to="/convert/pdf-to-word"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/70 backdrop-blur-md text-ink-700 font-semibold rounded-xl border border-ink-200/70 hover:border-brand-300 hover:text-brand-700 hover:shadow-md no-underline transition-all"
              >
                PDF to Word
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1.5">
                  {['from-pink-400 to-rose-500', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500', 'from-blue-400 to-indigo-500'].map((g, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${g} border-2 border-white`} />
                  ))}
                </div>
                <span className="ml-2 font-medium text-ink-700">500,000+</span> users worldwide
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="ml-1 font-medium text-ink-700">4.9</span> / 5.0
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust bar ===== */}
      <section className="relative border-y border-ink-100 bg-ink-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-600">
            {[
              { icon: <Shield size={15} className="text-emerald-600" />, label: '256-bit SSL encrypted' },
              { icon: <Zap size={15} className="text-amber-500" />, label: 'Processed in seconds' },
              { icon: <Globe size={15} className="text-blue-500" />, label: 'No installation needed' },
              { icon: <Lock size={15} className="text-rose-500" />, label: 'Files auto-deleted' },
              { icon: <CheckCircle2 size={15} className="text-brand-600" />, label: 'GDPR compliant' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 font-medium">
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trending Tools ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-100 to-rose-100 text-rose-700 text-xs font-semibold rounded-full mb-3">
              <Flame size={12} /> Trending now
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Most popular tools this week
            </h2>
            <p className="text-sm text-ink-500 mt-1">What everyone's using right now</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-ink-500">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="tabular">Updated daily</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {[
            { icon: <Merge size={22} />,       title: 'Merge PDF',     rank: 1, delta: '+12%', href: '/tools/merge',          accent: 'from-blue-500 to-blue-600' },
            { icon: <Minimize2 size={22} />,   title: 'Compress PDF',  rank: 2, delta: '+8%',  href: '/tools/compress',       accent: 'from-pink-500 to-rose-600' },
            { icon: <FileType size={22} />,    title: 'PDF to Word',   rank: 3, delta: '+15%', href: '/convert/pdf-to-word',  accent: 'from-blue-600 to-indigo-700' },
            { icon: <Presentation size={22} />,title: 'PDF to PPT',    rank: 4, delta: '+23%', href: '/convert/pdf-to-ppt',   accent: 'from-rose-500 to-pink-600' },
            { icon: <Scissors size={22} />,    title: 'Split PDF',     rank: 5, delta: '+4%',  href: '/tools/split',          accent: 'from-emerald-500 to-emerald-600' },
            { icon: <FileText size={22} />,    title: 'Edit PDF',      rank: 6, delta: '+18%', href: '/editor',               accent: 'from-brand-500 to-purple-600' },
          ].map((t) => (
            <Link
              key={t.title}
              to={t.href}
              className="group relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-white border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all duration-300 no-underline overflow-hidden"
            >
              <div className="absolute top-3 right-3 inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full tabular">
                <TrendingUp size={9} /> {t.delta}
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${t.accent} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                {t.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-ink-400 tabular">#{t.rank}</span>
                  <span className="text-sm font-semibold text-ink-900 group-hover:text-brand-700 transition-colors">{t.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Tools ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-4">
            <MousePointer2 size={12} />
            One click · No signup
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            Pick your tool. Get it done.
          </h2>
          <p className="text-ink-500 mt-3 max-w-xl mx-auto">
            Every tool you need to handle PDFs, Word, Excel, PowerPoint, and images — all in one place.
          </p>
        </div>

        <ToolGrid tools={pdfTools} title="PDF Tools" subtitle="Essential operations for your PDFs" />
        <ToolGrid tools={pdfConversions} title="Convert from PDF" subtitle="Turn PDFs into anything" />
        <ToolGrid tools={toPdfConversions} title="Convert to PDF" subtitle="Make anything a PDF" />
        <ToolGrid tools={wordConversions} title="Word conversions" />
        <ToolGrid tools={imageTools} title="Image tools" />
      </section>

      {/* ===== Stats ===== */}
      <section className="relative border-t border-ink-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="10M+" label="Documents processed" />
            <Stat value="500K+" label="Happy users" />
            <Stat value="25" label="Quality tools" />
            <Stat value="99.9%" label="Uptime SLA" />
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="relative bg-gradient-to-b from-ink-50/50 to-white border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-4">
              <Users size={12} />
              Trusted by teams worldwide
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Why businesses choose PDFCraft
            </h2>
            <p className="text-ink-500 mt-3">
              Built for professionals. Loved by individuals. Secure by design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Presentation size={24} />,
                title: 'Pixel-perfect conversions',
                desc: 'Convert PDFs to Word, Excel, and PowerPoint with layout preserved. Edit without losing formatting.',
                accent: 'from-brand-500 to-purple-600',
              },
              {
                icon: <Shield size={24} />,
                title: 'Enterprise-grade security',
                desc: 'Files encrypted in transit and at rest. Automatically deleted after processing. GDPR compliant.',
                accent: 'from-emerald-500 to-teal-600',
              },
              {
                icon: <Zap size={24} />,
                title: 'Fast & reliable',
                desc: 'Process PDFs in seconds. Handle files up to 200MB. Works on any device, any browser.',
                accent: 'from-amber-500 to-orange-600',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative bg-white rounded-2xl p-7 border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white bg-gradient-to-br ${f.accent} shadow-md group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Recommendations ===== */}
      <section className="relative bg-white border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-3">
              <Sparkles size={12} /> Hand-picked
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Recommended for you
            </h2>
            <p className="text-ink-500 mt-2 max-w-xl mx-auto">
              Our most loved combos — the tools our users return to most often.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Scan → Share',
                desc: 'OCR a scanned PDF and share a clean, searchable copy.',
                tools: [{ label: 'OCR', href: '/convert/ocr' }, { label: 'Compress', href: '/tools/compress' }],
                accent: 'from-brand-500 to-purple-600',
                icon: <ScanSearch size={22} />,
              },
              {
                title: 'Docs → Deck',
                desc: 'Turn a PDF report into a PowerPoint presentation in one click.',
                tools: [{ label: 'PDF to PPT', href: '/convert/pdf-to-ppt' }, { label: 'PDF to Image', href: '/convert/pdf-to-image' }],
                accent: 'from-rose-500 to-pink-600',
                icon: <Presentation size={22} />,
              },
              {
                title: 'Organize → Ship',
                desc: 'Merge, rearrange, and watermark before sending.',
                tools: [{ label: 'Merge', href: '/tools/merge' }, { label: 'Reorder', href: '/tools/reorder' }, { label: 'Watermark', href: '/tools/watermark' }],
                accent: 'from-emerald-500 to-teal-600',
                icon: <Merge size={22} />,
              },
            ].map((r) => (
              <div key={r.title} className="group relative bg-white rounded-2xl p-6 border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 overflow-hidden">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white bg-gradient-to-br ${r.accent} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  {r.icon}
                </div>
                <h3 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{r.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed mb-4">{r.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {r.tools.map((t) => (
                    <Link
                      key={t.href}
                      to={t.href}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink-50 hover:bg-brand-50 text-ink-700 hover:text-brand-700 text-xs font-semibold no-underline transition-colors"
                    >
                      {t.label} <ArrowRight size={11} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <FAQSection />

      {/* ===== CTA ===== */}
      <section className="relative bg-ink-950 overflow-hidden">
        {/* Aurora glow */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-20 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold rounded-full mb-5">
            <Sparkles size={12} />
            Start for free · No credit card
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            Ready to craft your next PDF?
          </h2>
          <p className="text-lg text-ink-300 max-w-xl mx-auto mb-10">
            Jump into the editor or pick any tool above. Fast, secure, and always free for basic use.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/editor"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-ink-900 font-semibold rounded-xl no-underline shadow-2xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all"
            >
              Open PDF Editor
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/15 hover:border-white/30 no-underline transition-all"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
