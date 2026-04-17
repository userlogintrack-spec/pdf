import { useRef, useState } from 'react';
import * as fabric from 'fabric';
import { X, Pen, Type, Upload } from 'lucide-react';

interface SignaturePadProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

type TabType = 'draw' | 'type' | 'upload';

export default function SignaturePad({ isOpen, onClose, onSave }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('draw');
  const [typedName, setTypedName] = useState('');
  const [signatureFont, setSignatureFont] = useState('cursive');

  // Initialize drawing canvas
  const initCanvas = (el: HTMLCanvasElement | null) => {
    if (!el || fabricRef.current) return;
    canvasRef.current = el;

    const canvas = new fabric.Canvas(el, {
      width: 500,
      height: 200,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = '#000000';
    fabricRef.current = canvas;
  };

  const handleClear = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = '#ffffff';
    }
    setTypedName('');
  };

  const handleSave = () => {
    let dataUrl = '';

    if (activeTab === 'draw' && fabricRef.current) {
      dataUrl = fabricRef.current.toDataURL({ format: 'png', multiplier: 1 });
    } else if (activeTab === 'type' && typedName) {
      // Render typed name to canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 500;
      tempCanvas.height = 200;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 500, 200);
        ctx.fillStyle = '#000000';
        ctx.font = `48px ${signatureFont}`;
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 20, 100);
        dataUrl = tempCanvas.toDataURL('image/png');
      }
    }

    if (dataUrl) {
      onSave(dataUrl);
      onClose();
      handleClear();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[560px] max-w-[95vw]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add Signature</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {([
            { id: 'draw' as TabType, label: 'Draw', icon: <Pen size={16} /> },
            { id: 'type' as TabType, label: 'Type', icon: <Type size={16} /> },
            { id: 'upload' as TabType, label: 'Upload', icon: <Upload size={16} /> },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'draw' && (
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <canvas ref={initCanvas} />
            </div>
          )}

          {activeTab === 'type' && (
            <div className="space-y-4">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your name"
                className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                style={{ fontFamily: signatureFont }}
              />
              <div className="flex gap-2">
                {['cursive', 'serif', 'Georgia', 'Brush Script MT'].map((font) => (
                  <button
                    key={font}
                    onClick={() => setSignatureFont(font)}
                    className={`px-3 py-2 text-sm rounded border cursor-pointer ${
                      signatureFont === font
                        ? 'bg-indigo-100 border-indigo-300'
                        : 'bg-white border-gray-300'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    Signature
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) {
                        onSave(dataUrl);
                        onClose();
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="signature-upload"
              />
              <label htmlFor="signature-upload" className="cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload a signature image</p>
                <p className="text-xs text-gray-400 mt-1">PNG with transparent background recommended</p>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Clear
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
