import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getDocument } from '../api/documents';
import { createEditSession, saveSession, addOperation as apiAddOperation } from '../api/editor';
import { pdfToWord } from '../api/conversions';
import type { DocumentInfo } from '../types/api';
import { useEditorStore } from '../store/useEditorStore';
import FileUpload from '../components/common/FileUpload';
import PDFViewer from '../components/editor/PDFViewer';
import EditorToolbar from '../components/editor/EditorToolbar';
import PageThumbnails from '../components/editor/PageThumbnails';
import PropertyPanel from '../components/editor/PropertyPanel';
import SignaturePad from '../components/editor/SignaturePad';
import * as fabric from 'fabric';

export default function EditorPage() {
  const { docId } = useParams<{ docId: string }>();
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { setSessionId, sessionId, activeTool, operations, reset } = useEditorStore();

  // Load document and create edit session
  useEffect(() => {
    if (!docId) return;
    const loadDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await getDocument(docId);
        setDocument(doc);
        const session = await createEditSession(docId);
        setSessionId(session.id);
      } catch (err) {
        setError('Failed to load document. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDocument();
    return () => { reset(); };
  }, [docId, setSessionId, reset]);

  // Track canvas reference
  useEffect(() => {
    const interval = setInterval(() => {
      const api = (window as unknown as Record<string, unknown>).__pdfcraft_canvas as {
        getCanvas: () => fabric.Canvas | null;
      } | undefined;
      if (api) {
        const c = api.getCanvas();
        if (c && c !== canvas) setCanvas(c);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [canvas]);

  // Open signature pad / image picker on tool select
  useEffect(() => {
    if (activeTool === 'signature') setShowSignaturePad(true);
    if (activeTool === 'image') imageInputRef.current?.click();
  }, [activeTool]);

  // Auto-save to backend (debounced)
  useEffect(() => {
    if (!sessionId || operations.length === 0) return;
    const timer = setTimeout(async () => {
      const lastOp = operations[operations.length - 1];
      if (lastOp && !lastOp.id) {
        try { await apiAddOperation(sessionId, lastOp); } catch { /* skip */ }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [sessionId, operations]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const { setActiveTool, undo, redo } = useEditorStore.getState();

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        return;
      }

      // Check if editing text in canvas
      const api = (window as unknown as Record<string, unknown>).__pdfcraft_canvas as {
        getCanvas: () => fabric.Canvas | null;
      } | undefined;
      const c = api?.getCanvas();
      const active = c?.getActiveObject();
      if (active instanceof fabric.IText && active.isEditing) return;

      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case 't': setActiveTool('text'); break;
        case 'i': setActiveTool('image'); break;
        case 's': if (!e.ctrlKey) setActiveTool('shape'); break;
        case 'd': setActiveTool('draw'); break;
        case 'h': setActiveTool('highlight'); break;
        case 'g': setActiveTool('signature'); break;
        case 'c': if (!e.ctrlKey) setActiveTool('comment'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSave = async () => {
    // Get fresh sessionId from store in case state is stale
    const currentSessionId = sessionId || useEditorStore.getState().sessionId;
    if (!currentSessionId) {
      alert('No edit session found. Please re-upload the PDF.');
      return;
    }
    setIsSaving(true);
    try {
      // Sync any unsaved operations
      for (const op of operations) {
        if (!op.id) { try { await apiAddOperation(currentSessionId, op); } catch { /* skip */ } }
      }

      const blob = await saveSession(currentSessionId);

      // Verify we got a PDF blob, not an error JSON
      if (blob.type && blob.type.includes('json')) {
        const text = await blob.text();
        console.error('Save returned error:', text);
        alert('Failed to save PDF. Please try again.');
        return;
      }

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = globalThis.document.createElement('a');
      link.href = url;
      link.download = `edited_${document?.original_filename || 'document.pdf'}`;
      link.style.display = 'none';
      globalThis.document.body.appendChild(link);
      link.click();

      // Cleanup after short delay
      setTimeout(() => {
        globalThis.document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvertToWord = async () => {
    if (!docId || !document) return;
    setIsConverting(true);
    try {
      await pdfToWord(docId, document.original_filename);
    } catch (err) {
      console.error('Convert failed:', err);
      alert('Conversion to Word failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSignatureSave = useCallback((dataUrl: string) => {
    const api = (window as unknown as Record<string, unknown>).__pdfcraft_canvas as {
      addSignature: (d: string) => void;
    } | undefined;
    api?.addSignature(dataUrl);
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const api = (window as unknown as Record<string, unknown>).__pdfcraft_canvas as {
        addImage: (url: string, id: string) => void;
      } | undefined;
      api?.addImage(dataUrl, 'local-' + Date.now());
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  // No document - upload prompt
  if (!docId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 bg-gray-50 min-h-[calc(100vh-64px)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Editor</h1>
          <p className="text-gray-500">Upload a PDF to start editing</p>
        </div>
        <FileUpload />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center bg-white rounded-xl p-10 border border-gray-200 shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
          <FileUpload />
        </div>
      </div>
    );
  }

  if (!document) return null;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <EditorToolbar onSave={handleSave} onConvertToWord={handleConvertToWord} isSaving={isSaving} isConverting={isConverting} />

      <div className="flex-1 flex overflow-hidden relative">
        <PageThumbnails documentId={document.id} pageCount={document.page_count} />
        <PDFViewer
          documentId={document.id}
          pageCount={document.page_count}
          pageWidth={document.width}
          pageHeight={document.height}
        />
        <PropertyPanel canvas={canvas} />
      </div>

      <SignaturePad
        isOpen={showSignaturePad}
        onClose={() => setShowSignaturePad(false)}
        onSave={handleSignatureSave}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        aria-label="Upload image to add to PDF"
      />
    </div>
  );
}
