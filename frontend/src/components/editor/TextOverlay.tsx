import { useState, useEffect, useRef, useCallback } from 'react';
import { getTextBlocks, modifyText } from '../../api/editor';
import type { TextBlock, TextModification } from '../../api/editor';
import { useEditorStore } from '../../store/useEditorStore';
import { Check, X, Loader2, Pencil, CheckCircle2, Bold, Italic, Palette, Trash2 } from 'lucide-react';

interface TextOverlayProps {
  documentId: string;
  pageWidth: number;
  pageHeight: number;
  displayWidth: number;
  displayHeight: number;
  onTextModified: () => void;
}

const FONT_SIZES = [6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];
const FONT_FAMILIES = [
  { value: 'helv', label: 'Helvetica' },
  { value: 'tiro', label: 'Times Roman' },
  { value: 'cour', label: 'Courier' },
];
const QUICK_COLORS = ['#000000', '#333333', '#FF0000', '#0000FF', '#008000', '#FF6600', '#9900CC', '#006699'];

interface EditState {
  text: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
}

export default function TextOverlay({
  documentId, pageWidth, pageHeight,
  displayWidth, displayHeight, onTextModified,
}: TextOverlayProps) {
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ text: '', fontSize: 12, fontFamily: 'helv', bold: false, italic: false, color: '#000000' });
  const [saving, setSaving] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showColors, setShowColors] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { currentPage, activeTool } = useEditorStore();

  const scaleX = displayWidth / pageWidth;
  const scaleY = displayHeight / pageHeight;

  useEffect(() => {
    if (!documentId) return;
    let cancelled = false;
    getTextBlocks(documentId, currentPage)
      .then((blocks) => { if (!cancelled) { setTextBlocks(blocks); setEditingBlock(null); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [documentId, currentPage]);

  useEffect(() => {
    if (editingBlock && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingBlock]);

  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(null), 2500); return () => clearTimeout(t); }
  }, [successMsg]);

  const startEditing = useCallback((block: TextBlock) => {
    if (activeTool !== 'select') return;
    setEditingBlock(block.id);
    let family = 'helv';
    const fn = block.font_name.toLowerCase();
    if (fn.includes('times') || fn.includes('tiro')) family = 'tiro';
    else if (fn.includes('courier') || fn.includes('cour')) family = 'cour';
    setEditState({ text: block.text, fontSize: block.font_size, fontFamily: family, bold: block.bold, italic: block.italic, color: block.font_color });
    setShowColors(false);
  }, [activeTool]);

  const cancelEditing = useCallback(() => { setEditingBlock(null); setShowColors(false); }, []);

  const saveEdit = useCallback(async (block: TextBlock, deleteMode = false) => {
    if (!deleteMode && editState.text === block.text && editState.fontSize === block.font_size &&
        editState.bold === block.bold && editState.italic === block.italic && editState.color === block.font_color) {
      cancelEditing();
      return;
    }
    setSaving(true);
    try {
      const mod: TextModification = {
        page: currentPage, original_text: block.text,
        new_text: deleteMode ? '' : editState.text,
        x: block.x, y: block.y, x2: block.x2, y2: block.y2,
        font_size: editState.fontSize, font_color: editState.color,
        bold: editState.bold, italic: editState.italic,
        origin_y: block.origin_y,
      };
      await modifyText(documentId, [mod]);
      const newBlocks = await getTextBlocks(documentId, currentPage);
      setTextBlocks(newBlocks);
      setEditingBlock(null);
      setShowColors(false);
      setSuccessMsg(deleteMode ? 'Text removed!' : 'Text updated!');
      onTextModified();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [editState, currentPage, documentId, onTextModified, cancelEditing]);

  if (activeTool !== 'select') return null;

  return (
    <div className="absolute inset-0 z-[5]">
      {textBlocks.map((block) => {
        const isEditing = editingBlock === block.id;
        const isHovered = hoveredBlock === block.id && !editingBlock;
        const left = block.x * scaleX;
        const top = block.y * scaleY;
        const width = Math.max(block.width * scaleX, 30);
        const height = Math.max(block.height * scaleY, 14);

        if (isEditing) {
          // Smart positioning - keep popup fully within viewport
          const popupWidth = 400;
          const popupHeight = 120;
          const goBelow = top < popupHeight + 10;
          let popupLeft = Math.max(left - 8, 4);
          // Prevent right overflow
          if (popupLeft + popupWidth > displayWidth - 8) {
            popupLeft = displayWidth - popupWidth - 8;
          }
          popupLeft = Math.max(popupLeft, 4);

          return (
            <div
              key={block.id}
              ref={popupRef}
              className="absolute z-20 animate-[fadeIn_0.15s_ease]"
              style={{
                left: `${popupLeft}px`,
                top: goBelow ? `${top + height + 8}px` : `${top - popupHeight - 8}px`,
                maxWidth: `${displayWidth - 16}px`,
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl border-2 border-indigo-400 overflow-hidden" style={{ width: `${Math.min(popupWidth, displayWidth - 16)}px` }}>
                {/* Formatting toolbar */}
                <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
                  <select value={editState.fontFamily}
                    onChange={(e) => setEditState((s) => ({ ...s, fontFamily: e.target.value }))}
                    className="h-7 px-1 text-[11px] bg-white border border-gray-200 rounded-md outline-none cursor-pointer font-medium" title="Font">
                    {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>

                  <select value={editState.fontSize}
                    onChange={(e) => setEditState((s) => ({ ...s, fontSize: Number(e.target.value) }))}
                    className="h-7 w-12 px-0.5 text-[11px] bg-white border border-gray-200 rounded-md outline-none cursor-pointer font-medium text-center" title="Size">
                    {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <div className="w-px h-5 bg-gray-200" />

                  <button type="button" title="Bold" onClick={() => setEditState((s) => ({ ...s, bold: !s.bold }))}
                    className={`w-7 h-7 flex items-center justify-center rounded-md cursor-pointer ${editState.bold ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}>
                    <Bold size={13} />
                  </button>

                  <button type="button" title="Italic" onClick={() => setEditState((s) => ({ ...s, italic: !s.italic }))}
                    className={`w-7 h-7 flex items-center justify-center rounded-md cursor-pointer ${editState.italic ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}>
                    <Italic size={13} />
                  </button>

                  <div className="w-px h-5 bg-gray-200" />

                  {/* Color */}
                  <div className="relative">
                    <button type="button" title="Color" onClick={() => setShowColors(!showColors)}
                      className="w-7 h-7 flex flex-col items-center justify-center rounded-md cursor-pointer hover:bg-gray-200">
                      <Palette size={12} className="text-gray-600" />
                      <div className="w-4 h-1 rounded-full" style={{ background: editState.color }} />
                    </button>
                    {showColors && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50">
                        <div className="grid grid-cols-4 gap-1.5 mb-2">
                          {QUICK_COLORS.map((c) => (
                            <button key={c} type="button"
                              onClick={() => { setEditState((s) => ({ ...s, color: c })); setShowColors(false); }}
                              className={`w-6 h-6 rounded cursor-pointer border-2 hover:scale-110 transition-transform ${editState.color === c ? 'border-indigo-500' : 'border-gray-200'}`}
                              style={{ background: c }} />
                          ))}
                        </div>
                        <input type="color" value={editState.color}
                          onChange={(e) => { setEditState((s) => ({ ...s, color: e.target.value })); setShowColors(false); }}
                          className="w-full h-6 rounded cursor-pointer border border-gray-200" title="Custom" />
                      </div>
                    )}
                  </div>

                  <div className="w-px h-5 bg-gray-200" />

                  {/* Delete text button */}
                  <button type="button" title="Remove this text" onClick={() => saveEdit(block, true)}
                    className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer text-red-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Input row */}
                <div className="flex items-center gap-1.5 px-2 py-2">
                  <input ref={inputRef} type="text" value={editState.text}
                    onChange={(e) => setEditState((s) => ({ ...s, text: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(block); if (e.key === 'Escape') cancelEditing(); }}
                    disabled={saving}
                    className="flex-1 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 focus:bg-white transition-colors text-sm"
                    style={{
                      fontWeight: editState.bold ? 'bold' : 'normal',
                      fontStyle: editState.italic ? 'italic' : 'normal',
                      color: editState.color,
                    }}
                    placeholder="Type text..." />

                  {saving ? (
                    <Loader2 size={16} className="text-indigo-500 animate-spin mx-2" />
                  ) : (
                    <>
                      <button type="button" onClick={() => saveEdit(block)} title="Save (Enter)"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500 text-white text-[11px] font-semibold rounded-lg hover:bg-emerald-600 cursor-pointer">
                        <Check size={12} /> Save
                      </button>
                      <button type="button" onClick={cancelEditing} title="Cancel (Esc)"
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer">
                        <X size={14} />
                      </button>
                    </>
                  )}
                </div>

                {/* Hints */}
                <div className="flex gap-3 px-2.5 py-1 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400">
                  <span><kbd className="px-1 bg-white rounded font-mono border border-gray-200">↵</kbd> Save</span>
                  <span><kbd className="px-1 bg-white rounded font-mono border border-gray-200">Esc</kbd> Cancel</span>
                  <span className="ml-auto"><kbd className="px-1 bg-white rounded font-mono border border-gray-200">🗑</kbd> Delete text</span>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={block.id} className="absolute cursor-pointer"
            style={{ left: `${left - 2}px`, top: `${top - 2}px`, width: `${width + 4}px`, height: `${height + 4}px` }}
            onClick={() => startEditing(block)}
            onMouseEnter={() => setHoveredBlock(block.id)}
            onMouseLeave={() => setHoveredBlock(null)}>
            <div className={`absolute inset-0 rounded transition-all duration-150 ${
              isHovered ? 'bg-blue-100/40 border-2 border-dashed border-blue-400/70' : 'border-2 border-transparent'
            }`} />
            {isHovered && (
              <>
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                  <Pencil size={11} className="text-white" />
                </div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-900/90 text-white text-[10px] font-medium rounded-md whitespace-nowrap pointer-events-none z-30">
                  Click to edit
                </div>
              </>
            )}
          </div>
        );
      })}

      {saving && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-30 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-5 flex flex-col items-center gap-3 shadow-2xl border border-gray-100">
            <Loader2 size={28} className="text-indigo-600 animate-spin" />
            <span className="text-sm font-semibold text-gray-700">Updating PDF...</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        </div>
      )}
    </div>
  );
}
