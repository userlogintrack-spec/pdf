import { useState, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

interface PropertyPanelProps {
  canvas: fabric.Canvas | null;
}

interface ObjectProps {
  type: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  opacity: number;
}

const FONTS = ['Helvetica', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];
const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

export default function PropertyPanel({ canvas }: PropertyPanelProps) {
  const [selected, setSelected] = useState<fabric.FabricObject | null>(null);
  const [props, setProps] = useState<ObjectProps | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const { activeTool } = useEditorStore();

  const updateProps = useCallback((obj: fabric.FabricObject | null) => {
    if (!obj) { setSelected(null); setProps(null); return; }
    setSelected(obj);
    setCollapsed(false); // Auto-open when object selected
    setProps({
      type: obj.type ?? 'unknown',
      fill: String(obj.fill ?? '#000000'),
      stroke: String(obj.stroke ?? '#000000'),
      strokeWidth: obj.strokeWidth ?? 1,
      fontSize: (obj as fabric.IText).fontSize ?? 16,
      fontFamily: (obj as fabric.IText).fontFamily ?? 'Helvetica',
      fontWeight: String((obj as fabric.IText).fontWeight ?? 'normal'),
      fontStyle: String((obj as fabric.IText).fontStyle ?? 'normal'),
      opacity: obj.opacity ?? 1,
    });
  }, []);

  useEffect(() => {
    if (!canvas) return;
    const onSelect = () => updateProps(canvas.getActiveObject() ?? null);
    const onClear = () => updateProps(null);
    canvas.on('selection:created', onSelect);
    canvas.on('selection:updated', onSelect);
    canvas.on('selection:cleared', onClear);
    return () => {
      canvas.off('selection:created', onSelect);
      canvas.off('selection:updated', onSelect);
      canvas.off('selection:cleared', onClear);
    };
  }, [canvas, updateProps]);

  const applyProp = (key: string, value: unknown) => {
    if (!selected || !canvas) return;
    (selected as unknown as Record<string, unknown>)[key] = value;
    selected.setCoords();
    canvas.renderAll();
    setProps((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleDelete = () => {
    if (!selected || !canvas) return;
    canvas.remove(selected);
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelected(null); setProps(null);
  };

  if (activeTool === 'select' && !props) return null;
  const isText = props?.type === 'i-text' || props?.type === 'textbox';

  if (collapsed || !props) {
    return (
      <button type="button" onClick={() => setCollapsed(false)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-14 bg-white border border-gray-200 border-r-0 flex items-center justify-center rounded-l cursor-pointer hover:bg-gray-50"
        title="Show properties">
        <ChevronLeft size={12} className="text-gray-400" />
      </button>
    );
  }

  return (
    <div className="w-44 bg-white border-l border-gray-200 overflow-y-auto relative">
      <button type="button" onClick={() => setCollapsed(true)}
        className="absolute left-1 top-1.5 z-10 p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer" title="Hide">
        <ChevronRight size={12} />
      </button>

      <div className="p-2.5 pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider ml-4">Properties</span>
          <button type="button" onClick={handleDelete} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer" title="Delete">
            <Trash2 size={12} />
          </button>
        </div>

        <div className="space-y-2.5">
          {isText && (
            <>
              <div>
                <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Font</label>
                <select value={props.fontFamily} onChange={(e) => applyProp('fontFamily', e.target.value)}
                  className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded outline-none bg-white">
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Size</label>
                <select value={props.fontSize} onChange={(e) => applyProp('fontSize', Number(e.target.value))}
                  className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded outline-none bg-white">
                  {FONT_SIZES.map((s) => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => applyProp('fontWeight', props.fontWeight === 'bold' ? 'normal' : 'bold')}
                  className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer border ${props.fontWeight === 'bold' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}>B</button>
                <button type="button" onClick={() => applyProp('fontStyle', props.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={`flex-1 py-1 text-xs italic rounded cursor-pointer border ${props.fontStyle === 'italic' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200'}`}>I</button>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Color</label>
                <input type="color" value={props.fill === 'transparent' ? '#000000' : props.fill}
                  onChange={(e) => applyProp('fill', e.target.value)} className="w-full h-7 rounded cursor-pointer border border-gray-200" />
              </div>
            </>
          )}

          {!isText && (
            <>
              <div>
                <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Fill</label>
                <div className="flex items-center gap-1.5">
                  <input type="color" value={!props.fill || props.fill === 'transparent' ? '#ffffff' : props.fill}
                    onChange={(e) => applyProp('fill', e.target.value)} className="w-7 h-7 rounded cursor-pointer border border-gray-200" />
                  <button type="button" onClick={() => applyProp('fill', 'transparent')}
                    className="text-[9px] text-gray-500 cursor-pointer px-1.5 py-0.5 border border-gray-200 rounded hover:bg-gray-50">None</button>
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Stroke</label>
                <input type="color" value={props.stroke || '#000000'} onChange={(e) => applyProp('stroke', e.target.value)}
                  className="w-full h-7 rounded cursor-pointer border border-gray-200" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Width</label>
                <input type="range" min="0" max="10" step="0.5" value={props.strokeWidth}
                  onChange={(e) => applyProp('strokeWidth', Number(e.target.value))} className="w-full" />
                <span className="text-[9px] text-gray-400">{props.strokeWidth}px</span>
              </div>
            </>
          )}

          <div>
            <label className="block text-[9px] text-gray-400 font-semibold uppercase mb-0.5">Opacity</label>
            <input type="range" min="0" max="1" step="0.1" value={props.opacity}
              onChange={(e) => applyProp('opacity', Number(e.target.value))} className="w-full" />
            <span className="text-[9px] text-gray-400">{Math.round(props.opacity * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
