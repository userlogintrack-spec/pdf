import {
  MousePointer2, Type, ImagePlus, Square, Pen,
  Highlighter, PenTool, MessageSquare, ZoomIn, ZoomOut,
  Undo2, Redo2, Download, ChevronLeft, ChevronRight, FileType, ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import type { EditorTool } from '../../store/useEditorStore';

const tools: { tool: EditorTool; icon: React.ReactNode; label: string; shortcut: string; hint: string }[] = [
  { tool: 'select', icon: <MousePointer2 size={16} />, label: 'Select', shortcut: 'V', hint: 'Click text to edit' },
  { tool: 'text', icon: <Type size={16} />, label: 'Text', shortcut: 'T', hint: 'Add new text' },
  { tool: 'image', icon: <ImagePlus size={16} />, label: 'Image', shortcut: 'I', hint: 'Add image' },
  { tool: 'shape', icon: <Square size={16} />, label: 'Shape', shortcut: 'S', hint: 'Add shape' },
  { tool: 'draw', icon: <Pen size={16} />, label: 'Draw', shortcut: 'D', hint: 'Freehand draw' },
  { tool: 'highlight', icon: <Highlighter size={16} />, label: 'Highlight', shortcut: 'H', hint: 'Highlight' },
  { tool: 'signature', icon: <PenTool size={16} />, label: 'Sign', shortcut: 'G', hint: 'Add signature' },
  { tool: 'comment', icon: <MessageSquare size={16} />, label: 'Note', shortcut: 'C', hint: 'Add note' },
];

interface EditorToolbarProps {
  onSave: () => void;
  onConvertToWord: () => void;
  isSaving: boolean;
  isConverting: boolean;
}

export default function EditorToolbar({ onSave, onConvertToWord, isSaving, isConverting }: EditorToolbarProps) {
  const { activeTool, setActiveTool, zoom, zoomIn, zoomOut, currentPage, totalPages, setCurrentPage, undoStack, redoStack, undo, redo } = useEditorStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false); };
    globalThis.document.addEventListener('mousedown', h);
    return () => globalThis.document.removeEventListener('mousedown', h);
  }, [showMenu]);

  const activeHint = tools.find((t) => t.tool === activeTool)?.hint;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-3 py-1.5 flex items-center gap-1.5">
        {/* Tools */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-gray-200">
          {tools.map((t) => (
            <button key={t.tool} type="button" onClick={() => setActiveTool(t.tool)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                activeTool === t.tool ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`} title={`${t.label} (${t.shortcut})`}>
              {t.icon}
              <span className="hidden xl:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-gray-200">
          <button type="button" onClick={undo} disabled={undoStack.length === 0}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer" title="Undo (Ctrl+Z)">
            <Undo2 size={15} />
          </button>
          <button type="button" onClick={redo} disabled={redoStack.length === 0}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer" title="Redo (Ctrl+Y)">
            <Redo2 size={15} />
          </button>
        </div>

        {/* Pages */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-gray-200">
          <button type="button" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}
            className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer" title="Previous">
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs text-gray-700 font-medium min-w-[50px] text-center">{currentPage + 1} / {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1}
            className="p-1 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 cursor-pointer" title="Next">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-gray-200">
          <button type="button" onClick={zoomOut} className="p-1 rounded text-gray-500 hover:bg-gray-100 cursor-pointer" title="Zoom out">
            <ZoomOut size={15} />
          </button>
          <span className="text-xs text-gray-600 font-medium min-w-[38px] text-center">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={zoomIn} className="p-1 rounded text-gray-500 hover:bg-gray-100 cursor-pointer" title="Zoom in">
            <ZoomIn size={15} />
          </button>
        </div>

        {/* Hint */}
        <span className="text-xs text-gray-400 hidden sm:inline ml-1">{activeHint}</span>

        <div className="flex-1" />

        {/* Download group */}
        <div className="relative" ref={menuRef}>
          <div className="flex items-center">
            <button type="button" onClick={onSave} disabled={isSaving || isConverting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-l-lg disabled:opacity-50 cursor-pointer transition-colors">
              <Download size={14} />
              {isSaving ? 'Saving...' : 'Download PDF'}
            </button>
            <button type="button" onClick={() => setShowMenu(!showMenu)} disabled={isSaving || isConverting}
              className="px-1.5 py-1.5 text-white bg-indigo-700 hover:bg-indigo-800 rounded-r-lg border-l border-indigo-500 disabled:opacity-50 cursor-pointer"
              title="More options">
              <ChevronDown size={14} />
            </button>
          </div>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-52 z-[100] animate-[fadeIn_0.1s_ease]">
              <button type="button" onClick={() => { onSave(); setShowMenu(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Download size={15} className="text-gray-400" />
                <span>Download as PDF</span>
              </button>
              <hr className="border-gray-100 my-0.5" />
              <button type="button" onClick={() => { onConvertToWord(); setShowMenu(false); }} disabled={isConverting}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50">
                <FileType size={15} className="text-blue-500" />
                <span>{isConverting ? 'Converting...' : 'Convert to Word (.docx)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
