import { useState, useCallback } from 'react';
import { ArrowDownUp, Loader2, GripVertical, Eye } from 'lucide-react';
import { getThumbnailUrl } from '../../api/documents';
import { requestPreview, downloadByToken } from '../../api/conversions';
import type { GenericPreview } from '../../api/conversions';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import PreviewModal from '../common/PreviewModal';
import type { DocumentInfo } from '../../types/api';

export default function ReorderTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<GenericPreview | null>(null);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
    setPageOrder(Array.from({ length: doc.page_count }, (_, i) => i));
  }, []);

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setPageOrder((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  const handleApply = async () => {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      const result = await requestPreview('/tools/reorder/', {
        document_id: document.id,
        new_order: pageOrder,
      });
      setPreview(result);
    } catch {
      setError('Reorder failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    await downloadByToken(preview.download_url, preview.filename);
  };

  const isChanged = document ? !pageOrder.every((p, i) => p === i) : false;

  return (
    <ToolLayout
      title="Reorder Pages"
      description="Drag and drop to rearrange pages in your PDF."
      icon={<ArrowDownUp size={20} />}
    >
      <PreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        onBackToOptions={() => setPreview(null)}
        onDownload={handleDownload}
        data={preview}
        title="Preview reordered PDF"
      />

      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <p className="font-medium text-gray-900">{document.original_filename}</p>
            <p className="text-sm text-gray-500">{document.page_count} pages · Drag pages to reorder</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
            {pageOrder.map((pageNum, index) => (
              <div
                key={`${pageNum}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative bg-white rounded-lg border-2 p-2 cursor-grab transition-all ${
                  dragIndex === index
                    ? 'border-indigo-500 opacity-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                }`}
              >
                <GripVertical size={14} className="absolute top-1 right-1 text-gray-400" />
                <img
                  src={getThumbnailUrl(document.id, pageNum)}
                  alt={`Page ${pageNum + 1}`}
                  className="w-full rounded mb-1"
                  loading="lazy"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Page {pageNum + 1}</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setPageOrder(Array.from({ length: document.page_count }, (_, i) => i))}
              className="px-4 py-3 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Reset Order
            </button>
            <button
              onClick={handleApply}
              disabled={processing || !isChanged}
              className="flex-1 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {processing ? (
                <><Loader2 size={18} className="animate-spin" /> Generating preview…</>
              ) : (
                <><Eye size={18} /> <ArrowDownUp size={18} /> Preview reordered PDF</>
              )}
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
