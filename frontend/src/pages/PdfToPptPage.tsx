import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Presentation, Loader2, CheckCircle, Download,
  Shield, Zap, Layout, FileText, FileType, FileSpreadsheet,
  Image, Code, Table, Pencil, Upload, X,
  CloudUpload, RotateCcw, ArrowRight, Layers, Eye,
  Settings2, ChevronDown, ChevronUp, Info, Clock,
  Sparkles, Lock, Globe,
} from 'lucide-react';
import { pdfToPpt } from '../api/conversions';
import type { DocumentInfo } from '../types/api';
import { useDocumentStore } from '../store/useDocumentStore';
import { useDropzone } from 'react-dropzone';

type ConversionMode = 'hybrid' | 'image' | 'editable';

const modeOptions: { value: ConversionMode; label: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
  {
    value: 'hybrid',
    label: 'Hybrid',
    desc: 'Image background + editable text overlay. Best quality with editability.',
    icon: <Layers size={20} />,
    badge: 'Recommended',
  },
  {
    value: 'image',
    label: 'Image Only',
    desc: 'Each page as a high-res image. Pixel-perfect but not editable.',
    icon: <Image size={20} />,
  },
  {
    value: 'editable',
    label: 'Fully Editable',
    desc: 'Native text, shapes, and images. Fully editable in PowerPoint.',
    icon: <Pencil size={20} />,
  },
];

const qualityPresets = [
  { label: 'Standard', dpi: 150, desc: 'Smaller file, good for screen' },
  { label: 'High', dpi: 250, desc: 'Best balance of quality and size' },
  { label: 'Ultra', dpi: 400, desc: 'Maximum quality, larger file' },
];

const relatedTools = [
  { icon: <FileType size={18} />, title: 'PDF to Word', href: '/convert/pdf-to-word', color: 'bg-blue-500' },
  { icon: <FileSpreadsheet size={18} />, title: 'PDF to Excel', href: '/convert/pdf-to-excel', color: 'bg-green-500' },
  { icon: <Image size={18} />, title: 'PDF to Image', href: '/convert/pdf-to-image', color: 'bg-purple-500' },
  { icon: <Code size={18} />, title: 'PDF to HTML', href: '/convert/pdf-to-html', color: 'bg-orange-500' },
  { icon: <FileText size={18} />, title: 'PDF to Text', href: '/convert/pdf-to-text', color: 'bg-slate-500' },
  { icon: <Table size={18} />, title: 'PDF to CSV', href: '/convert/pdf-to-csv', color: 'bg-emerald-500' },
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
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Conversion options
  const [mode, setMode] = useState<ConversionMode>('hybrid');
  const [qualityIdx, setQualityIdx] = useState(1); // default: High (250 dpi)
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleConvert = async () => {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      await pdfToPpt(document.id, document.original_filename, {
        mode,
        dpi: qualityPresets[qualityIdx].dpi,
      });
      setDone(true);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setDone(false);
    setDocument(null);
    setError(null);
  };

  return (
    <div className="min-h-[80vh]">
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="bg-[#e5322d] min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-black rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
          {/* Title */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-4 shadow-lg">
              <Presentation size={32} className="text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              PDF to PowerPoint
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-lg mx-auto">
              Convert PDF files to editable PowerPoint presentations with pixel-perfect layout and editable text.
            </p>
          </div>

          {done ? (
            /* ═══════ SUCCESS STATE ═══════ */
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center animate-in fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversion Complete!</h2>
              <p className="text-gray-500 mb-1">Your PowerPoint file has been downloaded.</p>
              {document && (
                <p className="text-sm text-gray-400 mb-8">
                  {document.original_filename.replace(/\.pdf$/i, '.pptx')}
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#e5322d] text-white rounded-xl font-semibold hover:bg-[#c42a25] cursor-pointer transition-colors"
                >
                  <RotateCcw size={18} /> Convert Another PDF
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 no-underline transition-colors"
                >
                  All Tools <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : !document ? (
            /* ═══════ UPLOAD STATE ═══════ */
            <div>
              <div
                {...getRootProps()}
                className={`bg-white rounded-3xl shadow-2xl p-8 sm:p-14 cursor-pointer transition-all duration-200 ${
                  isDragActive ? 'scale-[1.02] shadow-3xl ring-4 ring-white/50' : 'hover:shadow-3xl'
                } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <div className="py-4">
                    <Loader2 size={48} className="mx-auto text-[#e5322d] animate-spin mb-4" />
                    <p className="text-lg font-semibold text-gray-800">Uploading your PDF...</p>
                    <p className="text-sm text-gray-400 mt-1">This only takes a moment</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-[#e5322d] rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Upload size={28} className="text-white" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-2">Select PDF file</p>
                    <p className="text-gray-400 mb-6">or drop PDF here</p>
                    <button
                      type="button"
                      className="px-8 py-3 bg-[#e5322d] text-white font-semibold rounded-xl hover:bg-[#c42a25] transition-colors text-base"
                    >
                      Select PDF file
                    </button>
                    <p className="text-xs text-gray-400 mt-5">Max 200MB per file</p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-xl text-sm text-white">{error}</div>
              )}
            </div>
          ) : (
            /* ═══════ CONVERT STATE ═══════ */
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-left">
              {/* File card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-5">
                <div className="w-14 h-14 bg-[#e5322d]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Presentation size={26} className="text-[#e5322d]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 truncate text-base">{document.original_filename}</p>
                  <p className="text-sm text-gray-500">
                    {document.page_count} page{document.page_count !== 1 ? 's' : ''}
                    {document.file_size ? ` \u00B7 ${formatFileSize(document.file_size)}` : ''}
                    {' \u2192 '}{document.page_count} slide{document.page_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── Conversion Mode Selection ── */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Conversion Mode</label>
                <div className="grid gap-2">
                  {modeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMode(opt.value)}
                      className={`relative flex items-start gap-3 p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                        mode === opt.value
                          ? 'border-[#e5322d] bg-red-50/50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        mode === opt.value ? 'bg-[#e5322d] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {opt.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{opt.label}</span>
                          {opt.badge && (
                            <span className="px-2 py-0.5 bg-[#e5322d] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                      </div>
                      {/* Radio indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        mode === opt.value ? 'border-[#e5322d]' : 'border-gray-300'
                      }`}>
                        {mode === opt.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#e5322d]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Quality Preset (for image/hybrid modes) ── */}
              {mode !== 'editable' && (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Output Quality</label>
                  <div className="grid grid-cols-3 gap-2">
                    {qualityPresets.map((preset, idx) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setQualityIdx(idx)}
                        className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                          qualityIdx === idx
                            ? 'border-[#e5322d] bg-red-50/50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`block text-sm font-semibold ${qualityIdx === idx ? 'text-[#e5322d]' : 'text-gray-800'}`}>
                          {preset.label}
                        </span>
                        <span className="block text-[11px] text-gray-400 mt-0.5">{preset.dpi} DPI</span>
                        <span className="block text-[10px] text-gray-400">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Features indicator ── */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 mb-5 py-3 bg-gray-50 rounded-xl">
                {mode === 'image' ? (
                  <>
                    <span className="flex items-center gap-1.5"><Eye size={13} className="text-[#e5322d]" /> Pixel-perfect</span>
                    <span className="flex items-center gap-1.5"><Zap size={13} className="text-[#e5322d]" /> Fast conversion</span>
                    <span className="flex items-center gap-1.5"><Layout size={13} className="text-[#e5322d]" /> Exact layout</span>
                  </>
                ) : mode === 'editable' ? (
                  <>
                    <span className="flex items-center gap-1.5"><Pencil size={13} className="text-[#e5322d]" /> Editable text</span>
                    <span className="flex items-center gap-1.5"><Layers size={13} className="text-[#e5322d]" /> Native shapes</span>
                    <span className="flex items-center gap-1.5"><Image size={13} className="text-[#e5322d]" /> Extracted images</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5"><Eye size={13} className="text-[#e5322d]" /> Pixel-perfect</span>
                    <span className="flex items-center gap-1.5"><Pencil size={13} className="text-[#e5322d]" /> Editable text</span>
                    <span className="flex items-center gap-1.5"><Sparkles size={13} className="text-[#e5322d]" /> Best of both</span>
                  </>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* ── Convert button ── */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={processing}
                className="w-full py-4 bg-[#e5322d] text-white rounded-2xl font-bold text-lg hover:bg-[#c42a25] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3 transition-colors shadow-lg shadow-red-200/50"
              >
                {processing ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>Converting to PowerPoint...</span>
                  </>
                ) : (
                  <>
                    <Presentation size={22} />
                    <span>Convert to POWERPOINT</span>
                  </>
                )}
              </button>

              {processing && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  This may take a few seconds depending on the file size
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How to convert PDF to PowerPoint</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                icon: <Upload size={22} />,
                title: 'Upload Your PDF File',
                desc: 'Drag and drop a PDF file into the upload area or click the "Select PDF File" button to browse it from your device.',
              },
              {
                num: '2',
                icon: <Settings2 size={22} />,
                title: 'Choose Mode & Convert',
                desc: 'Select the conversion mode you need — Hybrid for best results, Image for pixel-perfect, or Editable for full editing. Then click Convert.',
              },
              {
                num: '3',
                icon: <Download size={22} />,
                title: 'Download PPT File',
                desc: 'Download the PPT to your device for easy viewing, editing, or sharing. Opens in PowerPoint, Google Slides, or Keynote.',
              },
            ].map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 bg-[#e5322d] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-red-200/40">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES SECTION ═══════ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Turn your PDFs into editable presentations</h2>
          <p className="text-gray-500 text-center text-sm mb-12 max-w-xl mx-auto">
            Three powerful conversion modes to fit every use case. From pixel-perfect snapshots to fully editable slides.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Layers size={24} className="text-[#e5322d]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Hybrid Mode</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                The best of both worlds. A pixel-perfect image background with editable text overlay. Your slides look exactly like the PDF, but you can still select, copy, and edit text.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Eye size={24} className="text-[#e5322d]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Image Mode</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every page rendered as a high-resolution image. 100% layout accuracy with fonts, colors, and graphics exactly as they appear in the PDF. Ideal for presentations where visual fidelity matters most.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Pencil size={24} className="text-[#e5322d]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Editable Mode</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Text, images, and shapes extracted as native PowerPoint elements. Click any text to edit it, resize images, change colors. Full control over every slide element.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST SECTION ═══════ */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Shield size={20} />, title: 'Secure Processing', desc: '256-bit SSL encryption. Files auto-deleted.', color: 'text-green-600 bg-green-50' },
              { icon: <Zap size={20} />, title: 'Lightning Fast', desc: 'Convert large PDFs in seconds.', color: 'text-amber-600 bg-amber-50' },
              { icon: <Globe size={20} />, title: 'Works Anywhere', desc: 'No installation. Any device, any browser.', color: 'text-blue-600 bg-blue-50' },
              { icon: <Lock size={20} />, title: 'Privacy First', desc: 'Your files never leave our secure servers.', color: 'text-red-600 bg-red-50' },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${f.color}`}>{f.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ RELATED TOOLS ═══════ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-3">More PDF Conversion Tools</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Need a different format? We've got you covered.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {relatedTools.map((tool) => (
              <Link key={tool.href} to={tool.href}
                className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#e5322d]/30 hover:shadow-md transition-all no-underline">
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-3 text-white group-hover:scale-110 transition-transform shadow-sm`}>
                  {tool.icon}
                </div>
                <span className="text-sm font-semibold text-gray-900">{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
