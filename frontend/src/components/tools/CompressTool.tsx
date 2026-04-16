import { useState, useCallback } from 'react';
import { Minimize2, Loader2, Eye } from 'lucide-react';
import { requestPreview, downloadByToken } from '../../api/conversions';
import type { GenericPreview } from '../../api/conversions';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import PreviewModal from '../common/PreviewModal';
import type { DocumentInfo } from '../../types/api';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CompressTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [quality, setQuality] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<GenericPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
  }, []);

  const handleCompress = async () => {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      const result = await requestPreview('/tools/compress/', {
        document_id: document.id,
        quality,
      });
      setPreview(result);
    } catch {
      setError('Compression failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    await downloadByToken(preview.download_url, preview.filename);
  };

  const qualities = [
    { value: 'low', label: 'Maximum Compression', desc: 'Smallest file, lower quality images' },
    { value: 'medium', label: 'Balanced', desc: 'Good balance of size and quality' },
    { value: 'high', label: 'High Quality', desc: 'Less compression, better image quality' },
  ];

  const compressedSize = preview?.compressed_size as number | undefined;
  const originalSize = preview?.original_size as number | undefined;
  const savedPercent =
    compressedSize && originalSize
      ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
      : null;

  return (
    <ToolLayout title="Compress PDF" description="Reduce PDF file size while maintaining quality." icon={<Minimize2 size={20} />}>
      <PreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        onBackToOptions={() => setPreview(null)}
        onDownload={handleDownload}
        data={preview}
        title={
          savedPercent !== null
            ? `Compressed — saved ${savedPercent}% (${formatSize(originalSize!)} → ${formatSize(compressedSize!)})`
            : 'Preview compressed PDF'
        }
      />

      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-ink-200 p-4 mb-6">
            <p className="font-semibold text-ink-900">{document.original_filename}</p>
            <p className="text-sm text-ink-500">
              Current size: {formatSize(document.file_size)} · {document.page_count} pages
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <label className="block text-sm font-semibold text-ink-700">Compression Level</label>
            {qualities.map((q) => (
              <button
                key={q.value}
                type="button"
                onClick={() => setQuality(q.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  quality === q.value
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-ink-200 bg-white hover:border-ink-300'
                }`}
              >
                <p className="font-semibold text-ink-900">{q.label}</p>
                <p className="text-sm text-ink-500">{q.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">{error}</div>
          )}

          <button
            onClick={handleCompress}
            disabled={processing}
            className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Compressing…</>
            ) : (
              <><Eye size={18} /> Preview compressed PDF</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
