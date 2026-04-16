import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Presentation, Loader2, CheckCircle2, Download,
  Shield, Zap, Layout, FileText, FileType, FileSpreadsheet,
  Image, Table, Pencil, Upload, X,
  RotateCcw, ArrowRight, Layers, Eye,
  Settings2, Info, Sparkles, Lock, Globe,
  ChevronLeft,
} from 'lucide-react';
import { pdfToPptPreview, downloadByToken } from '../api/conversions';
import type { PdfToPptPreview } from '../api/conversions';
import type { DocumentInfo } from '../types/api';
import { useDocumentStore } from '../store/useDocumentStore';
import { useDropzone } from 'react-dropzone';

type ConversionMode = 'hybrid' | 'image' | 'editable';

const modeOptions: { value: ConversionMode; label: string; desc: string; icon: React.ReactNode; badge?: string; accent: string }[] = [
  {
    value: 'image',
    label: 'Pixel-Perfect',
    desc: 'Each page as a crisp high-res image. Exact layout match, no ghost text.',
    icon: <Image size={20} />,
    badge: 'Recommended',
    accent: 'from-brand-500 to-purple-600',
  },
  {
    value: 'hybrid',
    label: 'Searchable',
    desc: 'Crisp image + invisible searchable text behind. Use Ctrl+F to find text.',
    icon: <Layers size={20} />,
    accent: 'from-cyan-500 to-blue-600',
  },
  {
    value: 'editable',
    label: 'Fully Editable',
    desc: 'Native text, shapes, and images. Click anything to edit in PowerPoint.',
    icon: <Pencil size={20} />,
    accent: 'from-emerald-500 to-teal-600',
  },
];

const qualityPresets = [
  { label: 'Standard', dpi: 150, desc: 'Smaller file, screen' },
  { label: 'High', dpi: 250, desc: 'Best balance' },
  { label: 'Ultra', dpi: 400, desc: 'Max quality' },
];

const relatedTools = [
  { icon: <FileType size={18} />, title: 'PDF to Word', href: '/convert/pdf-to-word', accent: 'from-blue-600 to-indigo-700' },
  { icon: <FileSpreadsheet size={18} />, title: 'PDF to Excel', href: '/convert/pdf-to-excel', accent: 'from-green-600 to-emerald-700' },
  { icon: <Image size={18} />, title: 'PDF to Image', href: '/convert/pdf-to-image', accent: 'from-purple-500 to-fuchsia-600' },
  { icon: <FileText size={18} />, title: 'PDF to Text', href: '/convert/pdf-to-text', accent: 'from-slate-500 to-slate-700' },
  { icon: <Table size={18} />, title: 'PDF to CSV', href: '/convert/pdf-to-csv', accent: 'from-emerald-600 to-teal-700' },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function PdfToPptPage() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState<PdfToPptPreview | null>(null);

  const [mode, setMode] = useState<ConversionMode>('image');
  const [qualityIdx, setQualityIdx] = useState(1);

  const { uploadDocument } = useDocumentStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const doc = await uploadDocument(acceptedFiles[0]);
      const { getDocument } = await import('../api/documents');
      const fullDoc = await getDocument(doc.id);
      setDocument(fullDoc);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [uploadDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading || processing,
  });

  const handleGeneratePreview = async () => {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      const result = await pdfToPptPreview(document.id, {
        mode,
        dpi: qualityPresets[qualityIdx].dpi,
      });
      setPreview(result);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    setDownloading(true);
    try {
      await downloadByToken(preview.download_url, preview.filename);
      setDone(true);
    } catch {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleBackToOptions = () => {
    setPreview(null);
  };

  const reset = () => {
    setDone(false);
    setDocument(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="relative">
      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-ink-950 overflow-hidden">
        {/* Aurora blobs */}
        <div className="absolute -top-40 -left-32 w-[560px] h-[560px] bg-brand-500/40 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-32 w-[640px] h-[640px] bg-purple-500/30 rounded-full blur-3xl animate-[aurora_14s_ease-in-out_infinite]" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-rose-500/20 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />

        {/* Grid */}
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-[0.15] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          {/* Eyebrow */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold rounded-full mb-6 animate-scale-in">
              <Sparkles size={12} className="text-rose-300" />
              PDF → PowerPoint · 3 modes
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 animate-slide-up"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}
            >
              Turn PDFs into editable
              <br />
              <span className="text-gradient">PowerPoint slides</span>
            </h1>
            <p className="text-base sm:text-lg text-ink-300 max-w-xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.08s' }}>
              Pixel-perfect layout. Editable text. Hybrid, Image, or fully-editable mode — pick the one that fits.
            </p>
          </div>

          {/* ═══════ STATE-BASED CARD ═══════ */}
          {done ? (
            /* SUCCESS */
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center animate-scale-in overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200 animate-[float_3s_ease-in-out_infinite]">
                  <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Conversion complete
                </h2>
                <p className="text-ink-500 mb-1">Your PowerPoint file has downloaded.</p>
                {document && (
                  <p className="text-sm text-ink-400 mb-8 font-mono truncate">
                    {document.original_filename.replace(/\.pdf$/i, '.pptx')}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-glow hover:-translate-y-0.5 cursor-pointer transition-all"
                  >
                    <RotateCcw size={18} /> Convert another
                  </button>
                  <Link
                    to="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-ink-200 text-ink-700 rounded-xl font-semibold hover:border-brand-300 hover:text-brand-700 no-underline transition-all"
                  >
                    All tools <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ) : !document ? (
            /* UPLOAD */
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div
                {...getRootProps()}
                className={`relative bg-white rounded-3xl shadow-2xl p-8 sm:p-14 cursor-pointer transition-all duration-300 overflow-hidden ${
                  isDragActive ? 'scale-[1.02] ring-4 ring-white/40' : 'hover:shadow-glow'
                } ${uploading ? 'pointer-events-none' : ''}`}
              >
                {/* Gradient border on drag */}
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 pointer-events-none ${isDragActive ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08), rgba(236,72,153,0.08))',
                  }}
                />
                <input {...getInputProps()} />

                {uploading ? (
                  <div className="py-4 text-center relative">
                    <div className="relative w-16 h-16 mx-auto mb-5">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 blur-xl opacity-60 animate-pulse" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Loader2 size={28} className="text-white animate-spin" strokeWidth={2.5} />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-ink-900">Uploading your PDF…</p>
                    <p className="text-sm text-ink-400 mt-1">Only takes a moment</p>
                  </div>
                ) : (
                  <div className="text-center relative">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 blur-xl opacity-40" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-pop">
                        <Upload size={32} className="text-white" strokeWidth={2.2} />
                      </div>
                    </div>
                    <p className="text-xl font-bold text-ink-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                      {isDragActive ? 'Drop your PDF here' : 'Select a PDF file'}
                    </p>
                    <p className="text-ink-500 mb-6">or drag and drop</p>
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all"
                    >
                      Choose PDF <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-ink-400 mt-5">Max 200MB · We delete your file automatically</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-rose-500/20 backdrop-blur-md border border-rose-500/30 rounded-xl text-sm text-white flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : preview ? (
            /* PREVIEW */
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-left animate-slide-up">
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <button
                  type="button"
                  onClick={handleBackToOptions}
                  className="p-2 -ml-2 text-ink-500 hover:text-ink-900 hover:bg-ink-50 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Back to options"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink-900 tracking-tight text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                    Preview your slides
                  </h3>
                  <p className="text-sm text-ink-500 mt-0.5 tabular">
                    {preview.slide_count} slide{preview.slide_count !== 1 ? 's' : ''} · {formatFileSize(preview.file_size)} · {preview.mode} mode
                  </p>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full shrink-0">
                  <CheckCircle2 size={12} /> Ready
                </div>
              </div>

              {/* Thumbnails grid */}
              <div className={`grid gap-3 mb-6 ${
                preview.slide_count === 1 ? 'grid-cols-1'
                : preview.slide_count === 2 ? 'grid-cols-2'
                : 'grid-cols-2 sm:grid-cols-3'
              } ${preview.slide_count > 6 ? 'max-h-[420px] overflow-y-auto pr-2' : ''}`}>
                {preview.preview_pages.map((p) => (
                  <div
                    key={p.index}
                    className="group relative rounded-xl overflow-hidden border border-ink-200 hover:border-brand-400 hover:shadow-md transition-all bg-ink-50"
                  >
                    <div className="aspect-[210/297] bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={p.preview_url}
                        alt={`Slide ${p.index}`}
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-ink-900/75 backdrop-blur-sm text-white text-[10px] font-bold rounded-full tabular">
                      Slide {p.index}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBackToOptions}
                  disabled={downloading}
                  className="sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-ink-200 text-ink-700 rounded-xl font-semibold hover:border-ink-300 hover:bg-ink-50 disabled:opacity-50 cursor-pointer transition-all"
                >
                  <Settings2 size={16} /> Change options
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="group flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 via-brand-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 cursor-pointer transition-all"
                >
                  {downloading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Downloading…</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Download {preview.filename}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-ink-400 mt-3 tabular">
                Preview expires in {Math.floor(preview.expires_in / 60)} minutes · Files are auto-deleted after that
              </p>
            </div>
          ) : (
            /* CONVERT */
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-left animate-slide-up">
              {/* File card */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-ink-50 to-brand-50/30 rounded-2xl mb-6 border border-ink-100">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Presentation size={24} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-900 truncate text-base">{document.original_filename}</p>
                  <p className="text-sm text-ink-500 tabular">
                    {document.page_count} page{document.page_count !== 1 ? 's' : ''}
                    {document.file_size ? ` · ${formatFileSize(document.file_size)}` : ''}
                    {' → '}
                    <span className="text-brand-700 font-medium">{document.page_count} slide{document.page_count !== 1 ? 's' : ''}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="p-2 text-ink-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Conversion Mode */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-ink-800">Conversion mode</label>
                  <span className="text-xs text-ink-400">Pick one</span>
                </div>
                <div className="grid gap-2">
                  {modeOptions.map((opt) => {
                    const active = mode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMode(opt.value)}
                        className={`relative flex items-start gap-3 p-4 rounded-2xl border text-left cursor-pointer transition-all overflow-hidden ${
                          active
                            ? 'border-transparent bg-gradient-to-br from-brand-50 to-purple-50/60 shadow-md shadow-brand-500/10 ring-2 ring-brand-500/30'
                            : 'border-ink-200 hover:border-ink-300 hover:bg-ink-50/50 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm transition-all bg-gradient-to-br ${active ? opt.accent : 'from-ink-300 to-ink-400 opacity-70'}`}>
                          {opt.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-ink-900 text-sm">{opt.label}</span>
                            {opt.badge && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-500 mt-1 leading-relaxed">{opt.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                          active ? 'border-brand-600 bg-white' : 'border-ink-300'
                        }`}>
                          {active && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-brand-500 to-purple-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quality */}
              {mode !== 'editable' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-ink-800">Output quality</label>
                    <span className="text-xs text-ink-400 tabular">{qualityPresets[qualityIdx].dpi} DPI</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {qualityPresets.map((preset, idx) => {
                      const active = qualityIdx === idx;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setQualityIdx(idx)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            active
                              ? 'border-transparent bg-gradient-to-br from-brand-50 to-purple-50/60 ring-2 ring-brand-500/30 shadow-sm'
                              : 'border-ink-200 hover:border-ink-300 hover:bg-ink-50/50'
                          }`}
                        >
                          <span className={`block text-sm font-semibold ${active ? 'text-brand-700' : 'text-ink-800'}`}>
                            {preset.label}
                          </span>
                          <span className="block text-[11px] text-ink-400 tabular mt-0.5">{preset.dpi} DPI</span>
                          <span className="block text-[10px] text-ink-400">{preset.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Features chip row */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-600 mb-6 py-3 px-4 bg-gradient-to-r from-ink-50 via-brand-50/30 to-purple-50/30 rounded-xl border border-ink-100">
                {mode === 'image' ? (
                  <>
                    <span className="flex items-center gap-1.5"><Eye size={13} className="text-brand-600" /> Pixel-perfect</span>
                    <span className="flex items-center gap-1.5"><Zap size={13} className="text-amber-500" /> Fast conversion</span>
                    <span className="flex items-center gap-1.5"><Layout size={13} className="text-emerald-600" /> Exact layout</span>
                  </>
                ) : mode === 'editable' ? (
                  <>
                    <span className="flex items-center gap-1.5"><Pencil size={13} className="text-brand-600" /> Editable text</span>
                    <span className="flex items-center gap-1.5"><Layers size={13} className="text-purple-600" /> Native shapes</span>
                    <span className="flex items-center gap-1.5"><Image size={13} className="text-rose-500" /> Extracted images</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5"><Eye size={13} className="text-brand-600" /> Pixel-perfect</span>
                    <span className="flex items-center gap-1.5"><Pencil size={13} className="text-purple-600" /> Editable text</span>
                    <span className="flex items-center gap-1.5"><Sparkles size={13} className="text-amber-500" /> Best of both</span>
                  </>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Convert CTA */}
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={processing}
                className="group relative w-full py-4 bg-gradient-to-r from-brand-600 via-brand-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 cursor-pointer flex items-center justify-center gap-3 transition-all overflow-hidden"
              >
                {processing ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>Generating preview…</span>
                  </>
                ) : (
                  <>
                    <Eye size={22} />
                    <span>Preview before download</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    {/* Sheen */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_1.2s_linear]" />
                    </div>
                  </>
                )}
              </button>

              {processing && (
                <p className="text-center text-xs text-ink-400 mt-3">
                  Hang tight — this may take a few seconds depending on file size
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full mb-4">
              <Zap size={12} /> Three simple steps
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              How to convert PDF to PowerPoint
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-brand-200 via-purple-200 to-rose-200" />

            {[
              {
                num: '1',
                icon: <Upload size={22} />,
                title: 'Upload your PDF',
                desc: 'Drag and drop your PDF or click to browse. Up to 200MB supported.',
                accent: 'from-brand-500 to-brand-700',
              },
              {
                num: '2',
                icon: <Settings2 size={22} />,
                title: 'Choose mode & quality',
                desc: 'Hybrid for best-of-both, Image for fidelity, Editable for full control.',
                accent: 'from-purple-500 to-purple-700',
              },
              {
                num: '3',
                icon: <Download size={22} />,
                title: 'Download PPT',
                desc: 'Opens in PowerPoint, Google Slides, or Keynote. Edit away.',
                accent: 'from-rose-500 to-pink-600',
              },
            ].map((s) => (
              <div key={s.num} className="text-center relative z-10">
                <div className={`relative w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${s.accent} flex items-center justify-center text-white font-extrabold text-xl shadow-md`}>
                  <span>{s.num}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-ink-500 text-xs font-medium mb-2">
                  <span className={`p-1 rounded-md text-white bg-gradient-to-br ${s.accent}`}>{s.icon}</span>
                </div>
                <h3 className="font-bold text-ink-900 mb-2 text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ MODES FEATURE SECTION ═══════ */}
      <section className="relative bg-gradient-to-b from-ink-50/60 to-white border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full mb-4">
              <Layers size={12} /> Three conversion modes
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              Built for every use case
            </h2>
            <p className="text-ink-500 mt-3">
              From pixel-perfect snapshots to fully editable native slides — pick the mode that fits your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                accent: 'from-brand-500 to-purple-600',
                icon: <Layers size={24} />,
                title: 'Hybrid',
                tag: 'Recommended',
                desc: 'Pixel-perfect image background layered with editable text. Looks exactly like the PDF — still edit the words.',
              },
              {
                accent: 'from-cyan-500 to-blue-600',
                icon: <Eye size={24} />,
                title: 'Image',
                tag: 'Max fidelity',
                desc: 'Every page rendered as a high-resolution image. 100% layout accuracy for presentations where visuals are king.',
              },
              {
                accent: 'from-emerald-500 to-teal-600',
                icon: <Pencil size={24} />,
                title: 'Editable',
                tag: 'Full control',
                desc: 'Native PowerPoint text, images, and shapes. Click any element to edit — resize, recolor, rearrange.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative bg-white rounded-2xl p-7 border border-ink-200/60 hover:border-transparent hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white bg-gradient-to-br ${f.accent} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  {f.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-ink-900 text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide text-white bg-gradient-to-r ${f.accent}`}>
                    {f.tag}
                  </span>
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TRUST ═══════ */}
      <section className="relative bg-white border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Shield size={22} />, title: 'Secure processing', desc: '256-bit SSL. Auto-deleted.', accent: 'from-emerald-500 to-teal-600' },
              { icon: <Zap size={22} />, title: 'Lightning fast', desc: 'Seconds, not minutes.', accent: 'from-amber-500 to-orange-600' },
              { icon: <Globe size={22} />, title: 'Works anywhere', desc: 'Any device, any browser.', accent: 'from-cyan-500 to-blue-600' },
              { icon: <Lock size={22} />, title: 'Privacy first', desc: 'Never shared, never stored.', accent: 'from-rose-500 to-pink-600' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-white bg-gradient-to-br ${f.accent} shadow-md`}>{f.icon}</div>
                <h4 className="font-bold text-ink-900 text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-ink-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ RELATED ═══════ */}
      <section className="relative bg-gradient-to-b from-ink-50/60 to-white border-t border-ink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
              More PDF conversion tools
            </h2>
            <p className="text-ink-500 text-sm mt-2">Need a different format? We've got you covered.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-ink-200/60 hover:border-transparent hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all no-underline"
              >
                <div className={`w-11 h-11 bg-gradient-to-br ${tool.accent} rounded-xl flex items-center justify-center mb-3 text-white group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md`}>
                  {tool.icon}
                </div>
                <span className="text-sm font-semibold text-ink-900">{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
