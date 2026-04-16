import { useState, useRef, useEffect } from 'react';
import { Square, Circle, Minus, ArrowRight, Triangle } from 'lucide-react';

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'arrow' | 'triangle';

interface ShapeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (shape: ShapeType) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const shapes = [
  { type: 'rectangle' as ShapeType, icon: <Square size={18} />, label: 'Rectangle' },
  { type: 'circle' as ShapeType, icon: <Circle size={18} />, label: 'Circle' },
  { type: 'line' as ShapeType, icon: <Minus size={18} />, label: 'Line' },
  { type: 'arrow' as ShapeType, icon: <ArrowRight size={18} />, label: 'Arrow' },
  { type: 'triangle' as ShapeType, icon: <Triangle size={18} />, label: 'Triangle' },
];

export default function ShapeSelector({ isOpen, onClose, onSelect, anchorRef }: ShapeSelectorProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
      style={{ top: position.top, left: position.left }}
    >
      {shapes.map((shape) => (
        <button
          key={shape.type}
          onClick={() => {
            onSelect(shape.type);
            onClose();
          }}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          {shape.icon}
          {shape.label}
        </button>
      ))}
    </div>
  );
}
