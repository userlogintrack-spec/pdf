import { useState, useCallback } from 'react';
import { Minimize2, Loader2, Download } from 'lucide-react';
import { compressPDF } from '../../api/tools';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import type { DocumentInfo } from '../../types/api';

export default function CompressTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [quality, setQuality] = useState('medium');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; ratio: string } | null>(null);
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
    setResult(null);
    try {
      const res = await compressPDF(document.id, quality);
      setResult(res);
    } catch {
      setError('Compression failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `compressed_${document?.original_filename || 'document.pdf'}`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const qualities = [
    { value: 'low', label: 'Maximum Compression', desc: 'Smallest file, lower quality images' },
    { value: 'medium', label: 'Balanced', desc: 'Good balance of size and quality' },
    { value: 'high', label: 'High Quality', desc: 'Less compression, better image quality' },
  ];

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality."
      icon={<Minimize2 size={20} />}
    >
      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <p className="font-medium text-gray-900">{document.original_filename}</p>
            <p className="text-sm text-gray-500">
              Current size: {formatSize(document.file_size)} · {document.page_count} pages
            </p>
          </div>

          {/* Quality selector */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700">Compression Level</label>
            {qualities.map((q) => (
              <button
                key={q.value}
                onClick={() => setQuality(q.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  quality === q.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900">{q.label}</p>
                <p className="text-sm text-gray-500">{q.desc}</p>
              </button>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="font-medium text-green-800">Compression Complete!</p>
              <p className="text-sm text-green-700 mt-1">
                {formatSize(document.file_size)} → {formatSize(result.blob.size)}
                <span className="ml-2 font-bold">({result.ratio}% smaller)</span>
              </p>
              <button
                onClick={handleDownload}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 cursor-pointer"
              >
                <Download size={16} /> Download Compressed PDF
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleCompress}
            disabled={processing}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Compressing...</>
            ) : (
              <><Minimize2 size={18} /> Compress PDF</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
