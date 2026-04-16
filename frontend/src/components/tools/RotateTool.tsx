import { useState, useCallback } from 'react';
import { RotateCw, Loader2 } from 'lucide-react';
import { getThumbnailUrl } from '../../api/documents';
import { rotatePDF } from '../../api/tools';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import type { DocumentInfo } from '../../types/api';

export default function RotateTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
  }, []);

  const rotateAll = (degrees: number) => {
    if (!document) return;
    const newRotations: Record<number, number> = {};
    for (let i = 0; i < document.page_count; i++) {
      newRotations[i] = ((rotations[i] || 0) + degrees) % 360;
    }
    setRotations(newRotations);
  };

  const rotatePage = (pageIndex: number) => {
    setRotations((prev) => ({
      ...prev,
      [pageIndex]: ((prev[pageIndex] || 0) + 90) % 360,
    }));
  };

  const handleApply = async () => {
    if (!document) return;
    const activeRotations = Object.fromEntries(
      Object.entries(rotations).filter(([, v]) => v !== 0)
    );
    if (Object.keys(activeRotations).length === 0) return;

    setProcessing(true);
    setError(null);
    try {
      await rotatePDF(document.id, activeRotations);
    } catch {
      setError('Rotation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate individual pages or all pages at once."
      icon={<RotateCw size={20} />}
    >
      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <p className="font-medium text-gray-900">{document.original_filename}</p>
            <p className="text-sm text-gray-500">{document.page_count} pages</p>
          </div>

          {/* Rotate all buttons */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => rotateAll(90)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
              Rotate All 90°
            </button>
            <button onClick={() => rotateAll(180)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
              Rotate All 180°
            </button>
            <button onClick={() => setRotations({})} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
              Reset All
            </button>
          </div>

          {/* Page grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
            {Array.from({ length: document.page_count }, (_, i) => (
              <button
                key={i}
                onClick={() => rotatePage(i)}
                className="text-center p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow cursor-pointer transition-all"
              >
                <div className="relative overflow-hidden rounded mb-1">
                  <img
                    src={getThumbnailUrl(document.id, i)}
                    alt={`Page ${i + 1}`}
                    className="w-full transition-transform"
                    style={{ transform: `rotate(${rotations[i] || 0}deg)` }}
                    loading="lazy"
                  />
                </div>
                <span className="text-xs text-gray-600">Page {i + 1}</span>
                {rotations[i] ? (
                  <span className="block text-[10px] text-indigo-600 font-medium">{rotations[i]}°</span>
                ) : null}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleApply}
            disabled={processing || Object.values(rotations).every((v) => v === 0)}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Rotating...</>
            ) : (
              <><RotateCw size={18} /> Apply Rotation</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
