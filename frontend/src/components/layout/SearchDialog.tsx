import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X,
  FileText, Merge, Scissors, RotateCw, ArrowDownUp, FileOutput,
  Minimize2, Droplets, ScanSearch,
  FileType, FileSpreadsheet, Image, Presentation,
  Table, FileUp, ImageDown,
} from 'lucide-react';

interface ToolItem {
  icon: React.ReactNode;
  label: string;
  desc: string;
  href: string;
  category: string;
  keywords: string[];
}

const allTools: ToolItem[] = [
  // PDF Tools
  { icon: <FileText size={18} />, label: 'Edit PDF', desc: 'Add text, images, shapes & annotations', href: '/editor', category: 'PDF Tools', keywords: ['edit', 'annotate', 'text', 'image', 'draw', 'sign'] },
  { icon: <Merge size={18} />, label: 'Merge PDF', desc: 'Combine multiple PDFs into one', href: '/tools/merge', category: 'PDF Tools', keywords: ['merge', 'combine', 'join', 'concatenate'] },
  { icon: <Scissors size={18} />, label: 'Split PDF', desc: 'Split PDF into multiple files', href: '/tools/split', category: 'PDF Tools', keywords: ['split', 'separate', 'divide', 'extract'] },
  { icon: <Minimize2 size={18} />, label: 'Compress PDF', desc: 'Reduce PDF file size', href: '/tools/compress', category: 'PDF Tools', keywords: ['compress', 'reduce', 'shrink', 'size', 'optimize', 'small'] },
  { icon: <RotateCw size={18} />, label: 'Rotate PDF', desc: 'Rotate PDF pages', href: '/tools/rotate', category: 'PDF Tools', keywords: ['rotate', 'turn', 'flip', 'orientation'] },
  { icon: <ArrowDownUp size={18} />, label: 'Reorder Pages', desc: 'Rearrange PDF pages', href: '/tools/reorder', category: 'PDF Tools', keywords: ['reorder', 'rearrange', 'sort', 'organize', 'pages'] },
  { icon: <FileOutput size={18} />, label: 'Extract Pages', desc: 'Extract specific pages from PDF', href: '/tools/extract', category: 'PDF Tools', keywords: ['extract', 'pages', 'select', 'pick'] },
  { icon: <Droplets size={18} />, label: 'Watermark', desc: 'Add text watermark to PDF', href: '/tools/watermark', category: 'PDF Tools', keywords: ['watermark', 'stamp', 'overlay', 'brand'] },
  { icon: <ScanSearch size={18} />, label: 'OCR', desc: 'Recognize text in scanned PDFs', href: '/convert/ocr', category: 'PDF Tools', keywords: ['ocr', 'scan', 'recognize', 'text recognition', 'optical'] },

  // Convert from PDF
  { icon: <FileType size={18} />, label: 'PDF to Word', desc: 'Convert PDF to DOCX', href: '/convert/pdf-to-word', category: 'Convert from PDF', keywords: ['pdf', 'word', 'docx', 'document'] },
  { icon: <FileSpreadsheet size={18} />, label: 'PDF to Excel', desc: 'Convert PDF to XLSX', href: '/convert/pdf-to-excel', category: 'Convert from PDF', keywords: ['pdf', 'excel', 'xlsx', 'spreadsheet', 'table'] },
  { icon: <Presentation size={18} />, label: 'PDF to PowerPoint', desc: 'Convert PDF to PPTX', href: '/convert/pdf-to-ppt', category: 'Convert from PDF', keywords: ['pdf', 'powerpoint', 'pptx', 'ppt', 'slides', 'presentation'] },
  { icon: <Image size={18} />, label: 'PDF to Image', desc: 'Convert PDF to PNG or JPEG', href: '/convert/pdf-to-image', category: 'Convert from PDF', keywords: ['pdf', 'image', 'png', 'jpeg', 'jpg', 'picture', 'photo'] },
  { icon: <FileText size={18} />, label: 'PDF to Text', desc: 'Extract text from PDF', href: '/convert/pdf-to-text', category: 'Convert from PDF', keywords: ['pdf', 'text', 'txt', 'extract', 'plain'] },
  { icon: <Table size={18} />, label: 'PDF to CSV', desc: 'Extract tables to CSV', href: '/convert/pdf-to-csv', category: 'Convert from PDF', keywords: ['pdf', 'csv', 'table', 'data', 'comma'] },

  // Convert to PDF
  { icon: <FileUp size={18} />, label: 'Word to PDF', desc: 'Convert DOCX to PDF', href: '/convert/word-to-pdf', category: 'Convert to PDF', keywords: ['word', 'docx', 'pdf', 'document'] },
  { icon: <FileUp size={18} />, label: 'Excel to PDF', desc: 'Convert XLSX to PDF', href: '/convert/excel-to-pdf', category: 'Convert to PDF', keywords: ['excel', 'xlsx', 'pdf', 'spreadsheet'] },
  { icon: <FileUp size={18} />, label: 'PowerPoint to PDF', desc: 'Convert PPTX to PDF', href: '/convert/ppt-to-pdf', category: 'Convert to PDF', keywords: ['powerpoint', 'pptx', 'ppt', 'pdf', 'slides'] },
  { icon: <FileUp size={18} />, label: 'Image to PDF', desc: 'Convert images to PDF', href: '/convert/image-to-pdf', category: 'Convert to PDF', keywords: ['image', 'png', 'jpg', 'jpeg', 'pdf', 'photo'] },
  { icon: <FileUp size={18} />, label: 'Text to PDF', desc: 'Convert TXT to PDF', href: '/convert/text-to-pdf', category: 'Convert to PDF', keywords: ['text', 'txt', 'pdf', 'plain'] },
  { icon: <FileUp size={18} />, label: 'CSV to PDF', desc: 'Convert CSV to PDF table', href: '/convert/csv-to-pdf', category: 'Convert to PDF', keywords: ['csv', 'pdf', 'table', 'data'] },

  // Word conversions
  { icon: <ImageDown size={18} />, label: 'Word to Image', desc: 'Convert DOCX to PNG/JPEG', href: '/convert/word-to-image', category: 'Word Tools', keywords: ['word', 'docx', 'image', 'png', 'jpeg', 'picture'] },
  { icon: <FileText size={18} />, label: 'Word to Text', desc: 'Extract text from Word', href: '/convert/word-to-text', category: 'Word Tools', keywords: ['word', 'docx', 'text', 'txt', 'extract'] },

  // Image tools
  { icon: <Image size={18} />, label: 'Image Format Converter', desc: 'PNG, JPG, WebP, BMP, GIF, TIFF', href: '/convert/image-format-convert', category: 'Image Tools', keywords: ['image', 'convert', 'png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'tiff', 'format'] },
  { icon: <Minimize2 size={18} />, label: 'Compress Image', desc: 'Reduce image file size', href: '/convert/image-compress', category: 'Image Tools', keywords: ['image', 'compress', 'reduce', 'shrink', 'size', 'optimize'] },
];

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        }
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allTools;
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/);
    return allTools
      .map((tool) => {
        const searchText = `${tool.label} ${tool.desc} ${tool.category} ${tool.keywords.join(' ')}`.toLowerCase();
        let score = 0;
        for (const word of words) {
          if (tool.label.toLowerCase().includes(word)) score += 10;
          else if (tool.keywords.some(k => k.includes(word))) score += 5;
          else if (searchText.includes(word)) score += 2;
          else score -= 20; // penalize non-matching words
        }
        return { ...tool, score };
      })
      .filter((t) => t.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  // Reset selected when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered.length, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      scrollToSelected(selectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
      scrollToSelected(selectedIndex - 1);
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].href);
      onClose();
    }
  };

  const scrollToSelected = (index: number) => {
    const container = resultsRef.current;
    if (!container) return;
    const el = container.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  };

  if (!open) return null;

  // Group by category
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <>
      {/* Backdrop - closes on click anywhere outside */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-100"
        onClick={onClose}
      />

      {/* Dialog wrapper - also closes on click outside the card */}
      <div
        className="fixed inset-0 z-[101] flex justify-center pt-[12vh] sm:pt-[15vh] px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-xl h-fit bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <Search size={20} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools... (e.g. merge, pdf to word, compress image)"
              className="flex-1 text-base text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Search size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No tools found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different keyword like "merge", "compress", or "image"</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, tools]) => (
                <div key={category}>
                  <div className="px-5 pt-3 pb-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</span>
                  </div>
                  {tools.map((tool) => {
                    flatIndex++;
                    const idx = flatIndex;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={tool.href}
                        type="button"
                        onClick={() => {
                          navigate(tool.href);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3.5 px-5 py-3 text-left cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                        } transition-colors`}>
                          {tool.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-900'} transition-colors`}>
                            {tool.label}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{tool.desc}</div>
                        </div>
                        {isSelected && (
                          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] text-indigo-400 bg-indigo-100 rounded font-mono">
                            ENTER
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-mono">&uarr;</kbd><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-mono">&darr;</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-mono">Enter</kbd> Open</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-mono">Esc</kbd> Close</span>
            </div>
            <span className="text-xs text-gray-400">{filtered.length} tool{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </>
  );
}
