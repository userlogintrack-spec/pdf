import { useEffect, useState } from 'react';
import {
  X, Download, Loader2, ChevronLeft, ChevronRight,
  CheckCircle2, Info, Smartphone, Copy, Check, Settings2,
} from 'lucide-react';

export interface PreviewPage {
  index: number;
  page_num: number;
  thumbnail_url: string;
  preview_url: string;
}

export interface PreviewData {
  token: string;
  download_url: string;
  filename: string;
  file_size: number;
  slide_count?: number;
  page_count?: number;
  expires_in: number;
  preview_pages?: PreviewPage[];
  /** Fallback: if no per-page preview (e.g. non-PDF output like .docx), show a single proxy image or a simple icon view */
  preview_image?: string;
  meta?: Record<string, string | number>;
}

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  onBackToOptions?: () => void;
  onDownload: () => Promise<void> | void;
  data: PreviewData | null;
  title?: string;
  /** Backend base url for QR code, defaults to window.location.origin */
  qrOrigin?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PreviewModal({
  open,
  onClose,
  onBackToOptions,
  onDownload,
  data,
  title = 'Preview your file',
  qrOrigin,
}: PreviewModalProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (open) {
      setActiveIdx(0);
      setDownloadError(null);
      setShowQR(false);
      setCopied(false);
    }
  }, [open, data?.token]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (data?.preview_pages && data.preview_pages.length > 1) {
        if (e.key === 'ArrowRight') setActiveIdx((i) => Math.min(i + 1, (data.preview_pages?.length || 1) - 1));
        if (e.key === 'ArrowLeft')  setActiveIdx((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, data?.preview_pages]);

  if (!open || !data) return null;

  const count = data.slide_count ?? data.page_count ?? data.preview_pages?.length ?? 1;
  const pages = data.preview_pages ?? [];
  const active = pages[activeIdx];

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await onDownload();
    } catch {
      setDownloadError('Download failed. Try again in a moment.');
    } finally {
      setDownloading(false);
    }
  };

  const absoluteDownloadUrl = (() => {
    const origin = qrOrigin ?? (typeof window !== 'undefined' ? window.location.origin : '');
    const url = data.download_url.startsWith('http') ? data.download_url : `${origin}${data.download_url}`;
    return url;
  })();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(absoluteDownloadUrl)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteDownloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-950/60 backdrop-blur-md z-[90] animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-[91] flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 sm:px-7 py-4 border-b border-ink-100 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-md">
              <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h3>
              <p className="text-xs text-ink-500 tabular truncate">
                {count > 1 ? `${count} pages · ` : ''}
                {formatFileSize(data.file_size)} · {data.filename}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-2 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-lg cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body: split view when multi-page, single view otherwise */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
            {/* Main preview area */}
            <div className="flex-1 bg-ink-50 relative flex items-center justify-center min-h-[320px] md:min-h-0 overflow-auto">
              {active ? (
                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                  <img
                    src={active.preview_url}
                    alt={`Page ${active.index}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl bg-white"
                    loading="eager"
                  />
                  {/* Page number badge */}
                  <div className="absolute top-6 left-6 px-2.5 py-1 bg-ink-900/75 backdrop-blur-sm text-white text-xs font-semibold rounded-full tabular">
                    Page {active.index} / {count}
                  </div>
                  {/* Prev / Next */}
                  {count > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
                        disabled={activeIdx === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center transition-all"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveIdx((i) => Math.min(i + 1, count - 1))}
                        disabled={activeIdx === count - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center transition-all"
                        aria-label="Next page"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
              ) : data.preview_image ? (
                <img src={data.preview_image} alt={data.filename} className="max-w-full max-h-full object-contain rounded-lg shadow-xl bg-white" />
              ) : (
                <div className="flex flex-col items-center text-ink-500 p-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white mb-4 shadow-lg">
                    <CheckCircle2 size={36} strokeWidth={2.5} />
                  </div>
                  <p className="font-semibold text-ink-900 mb-1">File ready</p>
                  <p className="text-xs">Preview not available for this format — click download to get the file.</p>
                </div>
              )}
            </div>

            {/* Thumbnails sidebar (desktop only, when > 1 page) */}
            {pages.length > 1 && (
              <div className="hidden md:flex md:flex-col md:w-40 border-l border-ink-100 bg-white overflow-y-auto shrink-0">
                <div className="px-3 py-2 text-[10px] font-bold text-ink-400 uppercase tracking-wider border-b border-ink-100 sticky top-0 bg-white z-10">
                  Pages
                </div>
                <div className="p-2 space-y-2">
                  {pages.map((p, idx) => (
                    <button
                      key={p.index}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`relative w-full aspect-[210/297] rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeIdx ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20' : 'border-ink-200 hover:border-ink-300'
                      }`}
                    >
                      <img src={p.thumbnail_url} alt={`Page ${p.index}`} className="w-full h-full object-contain bg-white" loading="lazy" />
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-ink-900/75 text-white text-[9px] font-bold rounded tabular">
                        {p.index}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR overlay */}
          {showQR && (
            <div
              className="absolute inset-0 bg-white/90 backdrop-blur-md z-10 flex items-center justify-center p-6 animate-fade-in"
              onClick={() => setShowQR(false)}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-md">
                  <Smartphone size={24} />
                </div>
                <h4 className="font-bold text-ink-900 mb-1 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Scan on mobile</h4>
                <p className="text-xs text-ink-500 mb-4">Scan this code with your phone to download the file there.</p>
                <div className="inline-block p-3 bg-white rounded-xl border-2 border-ink-100 mb-4">
                  <img src={qrUrl} alt="QR code" className="w-[220px] h-[220px] block" />
                </div>
                <button
                  type="button"
                  onClick={copyLink}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-700 rounded-xl font-medium text-sm cursor-pointer transition-colors mb-2"
                >
                  {copied ? <><Check size={15} /> Link copied</> : <><Copy size={15} /> Copy download link</>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  className="text-sm text-ink-500 hover:text-ink-900 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="px-5 sm:px-7 py-4 border-t border-ink-100 bg-white shrink-0">
            {downloadError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>{downloadError}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch">
              {onBackToOptions && (
                <button
                  type="button"
                  onClick={onBackToOptions}
                  disabled={downloading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-ink-200 text-ink-700 rounded-xl font-semibold hover:border-ink-300 hover:bg-ink-50 disabled:opacity-50 cursor-pointer transition-all text-sm"
                >
                  <Settings2 size={16} /> Change options
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowQR(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-ink-200 text-ink-700 rounded-xl font-semibold hover:border-brand-300 hover:text-brand-700 cursor-pointer transition-all text-sm"
              >
                <Smartphone size={16} /> Get on phone
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="group flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 via-brand-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 cursor-pointer transition-all"
              >
                {downloading ? (
                  <><Loader2 size={18} className="animate-spin" /> Downloading…</>
                ) : (
                  <><Download size={18} /> Download</>
                )}
              </button>
            </div>
            <p className="text-center text-[10px] text-ink-400 mt-2 tabular">
              Expires in {Math.floor(data.expires_in / 60)} min · Auto-deleted after
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
