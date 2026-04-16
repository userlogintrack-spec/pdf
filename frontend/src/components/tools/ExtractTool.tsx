import { useState, useCallback } from 'react';
import { FileOutput, Loader2, Eye } from 'lucide-react';
import { getThumbnailUrl } from '../../api/documents';
import { requestPreview, downloadByToken } from '../../api/conversions';
import type { GenericPreview } from '../../api/conversions';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import PreviewModal from '../common/PreviewModal';
import type { DocumentInfo } from '../../types/api';

export default function ExtractTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GenericPreview | null>(null);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
  }, []);

  const togglePage = (pageIndex: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageIndex)) next.delete(pageIndex);
      else next.add(pageIndex);
      return next;
    });
  };

  const selectAll = () => {
    if (!document) return;
    setSelectedPages(new Set(Array.from({ length: document.page_count }, (_, i) => i)));
  };

  const handleExtract = async () => {
    if (!document || selectedPages.size === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const result = await requestPreview('/tools/extract/', {
        document_id: document.id,
        pages: Array.from(selectedPages),
      });
      setPreview(result);
    } catch {
      setError('Extraction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    await downloadByToken(preview.download_url, preview.filename);
  };

  return (
    <ToolLayout
      title="Extract Pages"
      description="Select pages to extract into a new PDF."
      icon={<FileOutput size={20} />}
    >
      <PreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        onBackToOptions={() => setPreview(null)}
        onDownload={handleDownload}
        data={preview}
        title="Preview extracted PDF"
      />

      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{document.original_filename}</p>
              <p className="text-sm text-gray-500">{selectedPages.size} of {document.page_count} pages selected</p>
            </div>
            <div className="flex gap-2">
              <button onClick={selectAll} className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
                Select All
              </button>
              <button onClick={() => setSelectedPages(new Set())} className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 mb-6">
            {Array.from({ length: document.page_count }, (_, i) => (
              <button
                key={i}
                onClick={() => togglePage(i)}
                className={`relative p-2 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPages.has(i)
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selectedPages.has(i) && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                )}
                <img
                  src={getThumbnailUrl(document.id, i)}
                  alt={`Page ${i + 1}`}
                  className="w-full rounded mb-1"
                  loading="lazy"
                />
                <span className="text-xs text-gray-600">Page {i + 1}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleExtract}
            disabled={processing || selectedPages.size === 0}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Generating preview…</>
            ) : (
              <><Eye size={18} /> <FileOutput size={18} /> Preview {selectedPages.size} extracted pages</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
