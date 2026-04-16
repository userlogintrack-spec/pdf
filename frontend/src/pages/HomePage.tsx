import { Link } from 'react-router-dom';
import {
  Merge, Scissors, RotateCw, ArrowDownUp,
  FileOutput, Minimize2, Droplets, Lock, Unlock,
  FileType, FileSpreadsheet, Image, ScanSearch,
  Shield, Zap, Globe, ArrowRight,
  Presentation, Code, Table, FileUp, ImageDown,
  FileText,
} from 'lucide-react';

const pdfTools = [
  { icon: <Merge size={20} />, title: 'Merge PDF', desc: 'Combine multiple PDFs into one', href: '/tools/merge', color: 'text-blue-600 bg-blue-50' },
  { icon: <Scissors size={20} />, title: 'Split PDF', desc: 'Split into multiple files', href: '/tools/split', color: 'text-emerald-600 bg-emerald-50' },
  { icon: <Minimize2 size={20} />, title: 'Compress', desc: 'Reduce file size', href: '/tools/compress', color: 'text-pink-600 bg-pink-50' },
  { icon: <RotateCw size={20} />, title: 'Rotate', desc: 'Rotate PDF pages', href: '/tools/rotate', color: 'text-orange-600 bg-orange-50' },
  { icon: <ArrowDownUp size={20} />, title: 'Reorder', desc: 'Rearrange pages', href: '/tools/reorder', color: 'text-violet-600 bg-violet-50' },
  { icon: <FileOutput size={20} />, title: 'Extract', desc: 'Extract specific pages', href: '/tools/extract', color: 'text-teal-600 bg-teal-50' },
  { icon: <Droplets size={20} />, title: 'Watermark', desc: 'Add text watermark', href: '/tools/watermark', color: 'text-cyan-600 bg-cyan-50' },
  { icon: <Lock size={20} />, title: 'Protect', desc: 'Password protection', href: '/tools/protect', color: 'text-red-600 bg-red-50' },
  { icon: <Unlock size={20} />, title: 'Unlock', desc: 'Remove password', href: '/tools/unlock', color: 'text-amber-600 bg-amber-50' },
  { icon: <ScanSearch size={20} />, title: 'OCR', desc: 'Recognize text in scans', href: '/convert/ocr', color: 'text-gray-600 bg-gray-100' },
];

const pdfConversions = [
  { icon: <FileType size={20} />, title: 'PDF to Word', desc: 'Convert to DOCX', href: '/convert/pdf-to-word', color: 'text-blue-700 bg-blue-50' },
  { icon: <FileSpreadsheet size={20} />, title: 'PDF to Excel', desc: 'Convert to XLSX', href: '/convert/pdf-to-excel', color: 'text-green-700 bg-green-50' },
  { icon: <Presentation size={20} />, title: 'PDF to PPT', desc: 'Convert to PowerPoint', href: '/convert/pdf-to-ppt', color: 'text-rose-600 bg-rose-50' },
  { icon: <Image size={20} />, title: 'PDF to Image', desc: 'Convert to PNG/JPEG', href: '/convert/pdf-to-image', color: 'text-purple-600 bg-purple-50' },
  { icon: <FileText size={20} />, title: 'PDF to Text', desc: 'Extract text from PDF', href: '/convert/pdf-to-text', color: 'text-slate-600 bg-slate-50' },
  { icon: <Code size={20} />, title: 'PDF to HTML', desc: 'Convert to webpage', href: '/convert/pdf-to-html', color: 'text-orange-600 bg-orange-50' },
  { icon: <Table size={20} />, title: 'PDF to CSV', desc: 'Extract tables to CSV', href: '/convert/pdf-to-csv', color: 'text-emerald-700 bg-emerald-50' },
];

const toPdfConversions = [
  { icon: <FileUp size={20} />, title: 'Word to PDF', desc: 'DOCX to PDF', href: '/convert/word-to-pdf', color: 'text-blue-600 bg-blue-50' },
  { icon: <FileUp size={20} />, title: 'Excel to PDF', desc: 'XLSX to PDF', href: '/convert/excel-to-pdf', color: 'text-green-600 bg-green-50' },
  { icon: <FileUp size={20} />, title: 'PPT to PDF', desc: 'PowerPoint to PDF', href: '/convert/ppt-to-pdf', color: 'text-rose-500 bg-rose-50' },
  { icon: <FileUp size={20} />, title: 'Image to PDF', desc: 'PNG/JPG to PDF', href: '/convert/image-to-pdf', color: 'text-purple-500 bg-purple-50' },
  { icon: <FileUp size={20} />, title: 'HTML to PDF', desc: 'Webpage to PDF', href: '/convert/html-to-pdf', color: 'text-orange-500 bg-orange-50' },
  { icon: <FileUp size={20} />, title: 'Text to PDF', desc: 'TXT to PDF', href: '/convert/text-to-pdf', color: 'text-slate-500 bg-slate-50' },
  { icon: <FileUp size={20} />, title: 'CSV to PDF', desc: 'CSV table to PDF', href: '/convert/csv-to-pdf', color: 'text-emerald-500 bg-emerald-50' },
];

const wordConversions = [
  { icon: <ImageDown size={20} />, title: 'Word to Image', desc: 'DOCX to PNG/JPEG', href: '/convert/word-to-image', color: 'text-violet-600 bg-violet-50' },
  { icon: <Code size={20} />, title: 'Word to HTML', desc: 'DOCX to webpage', href: '/convert/word-to-html', color: 'text-cyan-600 bg-cyan-50' },
  { icon: <FileText size={20} />, title: 'Word to Text', desc: 'DOCX to plain text', href: '/convert/word-to-text', color: 'text-gray-600 bg-gray-50' },
];

const imageTools = [
  { icon: <Image size={20} />, title: 'Image Converter', desc: 'PNG, JPG, WebP, BMP, GIF', href: '/convert/image-format-convert', color: 'text-fuchsia-600 bg-fuchsia-50' },
  { icon: <Minimize2 size={20} />, title: 'Compress Image', desc: 'Reduce image file size', href: '/convert/image-compress', color: 'text-pink-600 bg-pink-50' },
];

function ToolGrid({ tools, title }: { tools: typeof pdfTools; title: string }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tools.map((tool) => (
          <Link key={tool.title} to={tool.href}
            className="group flex flex-col items-center text-center p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all no-underline bg-white">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 ${tool.color} group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <span className="text-sm font-semibold text-gray-900">{tool.title}</span>
            <span className="text-xs text-gray-400 mt-0.5">{tool.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-14">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-5">
              <Zap size={12} /> Free online PDF & document tools
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Every tool you need to work with documents
            </h1>
            <p className="text-lg text-gray-500 mb-8">
              Merge, split, compress, convert PDFs. Transform Word, Excel, PowerPoint, images and more. Free, fast, and secure.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/tools/merge" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 no-underline transition-colors shadow-sm hover:shadow-md hover:shadow-indigo-200">
                Merge PDFs
              </Link>
              <Link to="/convert/pdf-to-word" className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md no-underline transition-all">
                PDF to Word
              </Link>
              <Link to="/convert/pdf-to-ppt" className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md no-underline transition-all">
                PDF to PPT
              </Link>
              <Link to="/tools/compress" className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md no-underline transition-all">
                Compress PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500">
            <div className="flex items-center gap-1.5"><Shield size={15} className="text-green-600" /> 256-bit SSL encrypted</div>
            <div className="flex items-center gap-1.5"><Zap size={15} className="text-amber-500" /> Processed in seconds</div>
            <div className="flex items-center gap-1.5"><Globe size={15} className="text-blue-500" /> No installation needed</div>
            <div className="flex items-center gap-1.5"><Lock size={15} className="text-red-500" /> Files auto-deleted</div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">All Tools</h2>
          <p className="text-gray-500 mt-1">Select a tool to get started</p>
        </div>

        <ToolGrid tools={pdfTools} title="PDF Tools" />
        <ToolGrid tools={pdfConversions} title="Convert from PDF" />
        <ToolGrid tools={toPdfConversions} title="Convert to PDF" />
        <ToolGrid tools={wordConversions} title="Word Conversions" />
        <ToolGrid tools={imageTools} title="Image Tools" />
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Why businesses choose PDFCraft</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Presentation size={24} />, title: 'Pixel-Perfect Conversions', desc: 'Convert PDFs to Word, Excel, PowerPoint with layout preserved. Edit your documents without losing formatting.', color: 'text-indigo-600 bg-indigo-50' },
              { icon: <Shield size={24} />, title: 'Enterprise-grade Security', desc: 'Your files are encrypted in transit and at rest. Automatically deleted after processing. GDPR compliant.', color: 'text-green-600 bg-green-50' },
              { icon: <Zap size={24} />, title: 'Fast & Reliable', desc: 'Process PDFs in seconds, not minutes. Handle files up to 200MB. Works on any device, any browser.', color: 'text-amber-600 bg-amber-50' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-indigo-200 mb-6">Choose any tool above or use our PDF editor for advanced editing.</p>
          <Link to="/editor" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors no-underline">
            Open PDF Editor <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
