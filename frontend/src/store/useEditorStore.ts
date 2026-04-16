import { create } from 'zustand';
import type { EditOperation } from '../types/api';

export type EditorTool = 'select' | 'text' | 'image' | 'shape' | 'draw' | 'highlight' | 'signature' | 'comment';

interface EditorState {
  sessionId: string | null;
  currentPage: number;
  totalPages: number;
  zoom: number;
  activeTool: EditorTool;
  operations: EditOperation[];
  undoStack: EditOperation[][];
  redoStack: EditOperation[][];
  isModified: boolean;

  setSessionId: (id: string | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setActiveTool: (tool: EditorTool) => void;
  addOperation: (op: EditOperation) => void;
  updateOperation: (id: string, data: Partial<EditOperation>) => void;
  removeOperation: (id: string) => void;
  setOperations: (ops: EditOperation[]) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  sessionId: null,
  currentPage: 0,
  totalPages: 0,
  zoom: 1,
  activeTool: 'select',
  operations: [],
  undoStack: [],
  redoStack: [],
  isModified: false,

  setSessionId: (id) => set({ sessionId: id }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(3, zoom)) }),
  zoomIn: () => set((s) => ({ zoom: Math.min(3, s.zoom + 0.25) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(0.25, s.zoom - 0.25) })),
  setActiveTool: (tool) => set({ activeTool: tool }),

  addOperation: (op) => set((s) => ({
    operations: [...s.operations, op],
    undoStack: [...s.undoStack, s.operations],
    redoStack: [],
    isModified: true,
  })),

  updateOperation: (id, data) => set((s) => ({
    operations: s.operations.map((op) =>
      op.id === id ? { ...op, ...data } : op
    ),
    isModified: true,
  })),

  removeOperation: (id) => set((s) => ({
    operations: s.operations.filter((op) => op.id !== id),
    undoStack: [...s.undoStack, s.operations],
    redoStack: [],
    isModified: true,
  })),

  setOperations: (ops) => set({ operations: ops }),

  undo: () => set((s) => {
    if (s.undoStack.length === 0) return s;
    const prev = s.undoStack[s.undoStack.length - 1];
    return {
      operations: prev,
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, s.operations],
      isModified: true,
    };
  }),

  redo: () => set((s) => {
    if (s.redoStack.length === 0) return s;
    const next = s.redoStack[s.redoStack.length - 1];
    return {
      operations: next,
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, s.operations],
      isModified: true,
    };
  }),

  reset: () => set({
    sessionId: null,
    currentPage: 0,
    totalPages: 0,
    zoom: 1,
    activeTool: 'select',
    operations: [],
    undoStack: [],
    redoStack: [],
    isModified: false,
  }),
}));
