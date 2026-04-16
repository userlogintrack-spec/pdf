import { create } from 'zustand';
import type { DocumentInfo } from '../types/api';
import * as docApi from '../api/documents';

interface DocumentState {
  currentDocument: DocumentInfo | null;
  documents: DocumentInfo[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadDocument: (file: File) => Promise<DocumentInfo>;
  setCurrentDocument: (doc: DocumentInfo | null) => void;
  clearError: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  currentDocument: null,
  documents: [],
  isUploading: false,
  uploadProgress: 0,
  error: null,

  uploadDocument: async (file: File) => {
    set({ isUploading: true, uploadProgress: 0, error: null });
    try {
      const doc = await docApi.uploadDocument(file);
      set((state) => ({
        currentDocument: doc,
        documents: [doc, ...state.documents],
        isUploading: false,
        uploadProgress: 100,
      }));
      return doc;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      set({ isUploading: false, error: message });
      throw err;
    }
  },

  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  clearError: () => set({ error: null }),
}));
