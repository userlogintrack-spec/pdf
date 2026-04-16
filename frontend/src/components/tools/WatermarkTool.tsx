import { useState, useCallback } from 'react';
import { Droplets, Loader2 } from 'lucide-react';
import { addWatermark } from '../../api/tools';
import FileUpload from '../common/FileUpload';
import ToolLayout from './ToolLayout';
import type { DocumentInfo } from '../../types/api';

export default function WatermarkTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [text, setText] = useState('DRAFT');
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState('#CCCCCC');
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState('center');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
  }, []);

  const handleApply = async () => {
    if (!document || !text.trim()) return;
    setProcessing(true);
    setError(null);
    try {
      await addWatermark(document.id, {
        text, font_size: fontSize, color, opacity, rotation, position,
      });
    } catch {
      setError('Failed to add watermark. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const positions = [
    { value: 'center', label: 'Center' },
    { value: 'diagonal', label: 'Diagonal' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  return (
    <ToolLayout
      title="Add Watermark"
      description="Add a text watermark to your PDF pages."
      icon={<Droplets size={20} />}
    >
      {!document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <p className="font-medium text-gray-900">{document.original_filename}</p>
            <p className="text-sm text-gray-500">{document.page_count} pages</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5 mb-6">
            {/* Watermark text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Watermark Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter watermark text"
              />
            </div>

            {/* Font size and color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min={10}
                  max={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation: {rotation}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {positions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPosition(p.value)}
                    className={`px-3 py-2 text-xs rounded-lg border cursor-pointer ${
                      position === p.value
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="relative bg-gray-50 rounded-lg border border-gray-200 h-40 flex items-center justify-center overflow-hidden">
              <span
                className="font-bold select-none"
                style={{
                  fontSize: `${Math.min(fontSize / 2, 40)}px`,
                  color: color,
                  opacity: opacity,
                  transform: `rotate(-${rotation}deg)`,
                }}
              >
                {text || 'WATERMARK'}
              </span>
              <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">Preview</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleApply}
            disabled={processing || !text.trim()}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Applying watermark...</>
            ) : (
              <><Droplets size={18} /> Add Watermark</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
