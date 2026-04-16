import { Link } from 'react-router-dom';
import { FileText, Shield, Heart } from 'lucide-react';

const GithubIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .269.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TwitterIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const linkGroups = [
  {
    title: 'PDF Tools',
    links: [
      { label: 'Edit PDF', href: '/editor' },
      { label: 'Merge PDF', href: '/tools/merge' },
      { label: 'Split PDF', href: '/tools/split' },
      { label: 'Compress PDF', href: '/tools/compress' },
      { label: 'Rotate PDF', href: '/tools/rotate' },
      { label: 'Watermark', href: '/tools/watermark' },
    ],
  },
  {
    title: 'Convert',
    links: [
      { label: 'PDF to Word', href: '/convert/pdf-to-word' },
      { label: 'PDF to Excel', href: '/convert/pdf-to-excel' },
      { label: 'PDF to PowerPoint', href: '/convert/pdf-to-ppt' },
      { label: 'PDF to Image', href: '/convert/pdf-to-image' },
      { label: 'Word to PDF', href: '/convert/word-to-pdf' },
      { label: 'OCR', href: '/convert/ocr' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Features', href: '/features' },
      { label: 'Compare', href: '/compare' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-ink-950 text-ink-400 overflow-hidden">
      {/* Gradient top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

      {/* Subtle glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[80%] h-48 bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 rounded-xl flex items-center justify-center shadow-pop group-hover:scale-105 transition-transform">
                <FileText size={18} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                PDFCraft
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-ink-400 max-w-sm">
              Professional PDF editing, conversion, and management tools. Built for speed, privacy, and polish.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { icon: GithubIcon, label: 'GitHub' },
                { icon: TwitterIcon, label: 'Twitter' },
                { icon: LinkedinIcon, label: 'LinkedIn' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-ink-400 hover:text-white transition-all cursor-pointer"
                >
                  {s.icon}
                </button>
              ))}
            </div>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 mt-6 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <Shield size={12} />
              Files auto-deleted · GDPR compliant
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-tight">{group.title}</h4>
              <ul className="space-y-2.5 text-sm list-none p-0 m-0">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href === '#' ? (
                      <span className="text-ink-400 cursor-default">{link.label}</span>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-ink-400 hover:text-white no-underline transition-colors inline-block hover:translate-x-0.5 transform duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            &copy; {new Date().getFullYear()} PDFCraft. All rights reserved.
          </p>
          <p className="text-xs text-ink-500 flex items-center gap-1.5">
            Crafted with <Heart size={12} className="text-rose-500 fill-rose-500" /> for document lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
