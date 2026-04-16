import { useState, useCallback } from 'react';
import { Scissors, Loader2 } from 'lucide-react';
import { uploadDocument, getThumbnailUrl } from '../../api/documents';
import { splitPDF } from '../../api/tools';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import type { DocumentInfo } from '../../types/api';

export default function SplitTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [ranges, setRanges] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
    setRanges(`1-${doc.page_count}`);
  }, []);

  const handleSplit = async () => {
    if (!document || !ranges.trim()) return;
    setSplitting(true);
    setError(null);
    try {
      const rangeList = ranges.split(',').map((r) => r.trim()).filter(Boolean);
      await splitPDF(document.id, rangeList);
    } catch {
      setError('Split failed. Check your page ranges.');
    } finally {
      setSplitting(false);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Split a PDF into multiple files by page ranges."
      icon={<Scissors size={20} />}
    >
      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          {/* Document info */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <p className="font-medium text-gray-900">{document.original_filename}</p>
            <p className="text-sm text-gray-500">{document.page_count} pages</p>
          </div>

          {/* Page thumbnails */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
            {Array.from({ length: document.page_count }, (_, i) => (
              <div key={i} className="text-center">
                <img
                  src={getThumbnailUrl(document.id, i)}
                  alt={`Page ${i + 1}`}
                  className="w-full rounded border border-gray-200"
                  loading="lazy"
                />
                <span className="text-[10px] text-gray-500">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Range input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Ranges</label>
            <input
              type="text"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="e.g., 1-3, 4-6, 7-10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Separate ranges with commas. Example: 1-3, 4-6, 7</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleSplit}
            disabled={splitting || !ranges.trim()}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {splitting ? (
              <><Loader2 size={18} className="animate-spin" /> Splitting...</>
            ) : (
              <><Scissors size={18} /> Split PDF</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
