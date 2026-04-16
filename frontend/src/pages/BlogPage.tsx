import { Link } from 'react-router-dom';
import {
  Sparkles, Clock, User, ArrowRight, Tag, Rss,
} from 'lucide-react';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tag: string;
  accent: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    slug: 'pdf-to-ppt-three-modes',
    title: 'PDF to PowerPoint: Pixel-Perfect vs Searchable vs Editable',
    excerpt: 'Three conversion modes, three completely different outcomes. Here\'s when to use each one and why your IRCTC ticket probably needs the pixel-perfect mode.',
    author: 'Bhavesh',
    date: '2026-04-15',
    readTime: '6 min',
    category: 'Tutorial',
    tag: 'Convert',
    accent: 'from-rose-500 to-pink-600',
    featured: true,
  },
  {
    slug: 'why-your-files-are-auto-deleted',
    title: 'Why we auto-delete your files (and why you should care)',
    excerpt: 'A short walkthrough of our retention policy, why it\'s not just marketing fluff, and how "file auto-deletion" actually works behind the scenes.',
    author: 'Bhavesh',
    date: '2026-04-10',
    readTime: '4 min',
    category: 'Privacy',
    tag: 'Security',
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    slug: 'compressing-pdfs-without-losing-quality',
    title: 'The art of compressing PDFs without losing quality',
    excerpt: 'Three quality presets, one golden rule: pick the lowest DPI that still reads. Plus a cheat sheet for emails, archives, and print.',
    author: 'Bhavesh',
    date: '2026-04-05',
    readTime: '5 min',
    category: 'Guide',
    tag: 'Compress',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    slug: 'ocr-explained',
    title: 'OCR in 3 minutes: Making scanned PDFs searchable',
    excerpt: 'What Optical Character Recognition actually does, when it works beautifully, and when it stumbles (hint: handwriting is still hard).',
    author: 'Bhavesh',
    date: '2026-04-01',
    readTime: '3 min',
    category: 'Explainer',
    tag: 'OCR',
    accent: 'from-cyan-500 to-blue-600',
  },
  {
    slug: 'merge-split-organize',
    title: 'Merge, split, organize: the PDF productivity trio',
    excerpt: 'The three tools 80% of our users reach for first. Shortcuts, power-user tricks, and why drag-to-reorder beats typing page numbers.',
    author: 'Bhavesh',
    date: '2026-03-28',
    readTime: '7 min',
    category: 'Tutorial',
    tag: 'Tools',
    accent: 'from-brand-500 to-purple-600',
  },
  {
    slug: 'indian-document-workflows',
    title: 'Designing for Indian document workflows',
    excerpt: 'IRCTC tickets, GST invoices, Aadhaar scans — building a PDF tool that respects the Indian document ecosystem took more than translation.',
    author: 'Bhavesh',
    date: '2026-03-22',
    readTime: '8 min',
    category: 'Product',
    tag: 'Design',
    accent: 'from-fuchsia-500 to-pink-600',
  },
];

const categories = ['All', 'Tutorial', 'Guide', 'Explainer', 'Privacy', 'Product'];

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article
      className={`group relative rounded-2xl overflow-hidden bg-white border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Cover */}
      <div className={`relative ${featured ? 'h-56 md:h-72' : 'h-44'} bg-gradient-to-br ${post.accent} overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-grid" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {post.category}
          </span>
          {featured && (
            <span className="px-2.5 py-1 bg-white text-ink-900 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        <h3 className={`font-bold text-ink-900 tracking-tight mb-2 group-hover:text-brand-700 transition-colors ${featured ? 'text-2xl' : 'text-lg'}`} style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          {post.title}
        </h3>
        <p className={`text-ink-500 leading-relaxed mb-4 ${featured ? 'text-base' : 'text-sm'}`}>{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-ink-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
          </div>
          <span className="tabular">{post.date}</span>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-brand-500/40 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] bg-purple-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6">
            <Rss size={12} className="text-brand-300" /> The PDFCraft blog
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
            Ideas, tutorials &amp;
            <br />
            <span className="text-gradient">behind-the-scenes</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">
            Writeups from the team about PDFs, conversions, privacy, and the gnarly details of document tooling.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-16 z-20 bg-white/85 backdrop-blur-md border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700 cursor-pointer transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {featured && (
              <Link to="#" className="no-underline md:col-span-2">
                <PostCard post={featured} featured />
              </Link>
            )}
            {rest.map((p) => (
              <Link key={p.slug} to="#" className="no-underline">
                <PostCard post={p} />
              </Link>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl border border-dashed border-ink-300 bg-ink-50/60 text-center">
            <Sparkles size={20} className="inline-block text-brand-600 mb-2" />
            <p className="text-sm text-ink-600">
              More posts coming soon. Want a topic covered?{' '}
              <Link to="/contact" className="text-brand-600 hover:text-brand-700 font-semibold no-underline">Suggest one</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="relative bg-ink-950 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold rounded-full mb-4">
            <Tag size={12} /> 1 email a month, no spam
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Get the next article in your inbox
          </h2>
          <form className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none text-sm transition-all"
            />
            <button
              type="submit"
              className="group px-6 py-3 bg-white text-ink-900 font-semibold rounded-xl hover:-translate-y-0.5 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <p className="text-xs text-ink-400 mt-3">Unsubscribe with one click. We won't sell your email.</p>
        </div>
      </section>
    </div>
  );
}
