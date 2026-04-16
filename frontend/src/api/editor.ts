import api from './client';
import type { EditSession, EditOperation } from '../types/api';

export async function createEditSession(documentId: string): Promise<EditSession> {
  const response = await api.post('/editor/sessions/', { document: documentId });
  return response.data;
}

export async function getEditSession(sessionId: string): Promise<EditSession> {
  const response = await api.get(`/editor/sessions/${sessionId}/`);
  return response.data;
}

export async function addOperation(sessionId: string, operation: Omit<EditOperation, 'id'>): Promise<EditOperation> {
  const response = await api.post(`/editor/sessions/${sessionId}/operations/`, operation);
  return response.data;
}

export async function updateOperation(sessionId: string, opId: string, data: Partial<EditOperation>): Promise<EditOperation> {
  const response = await api.put(`/editor/sessions/${sessionId}/operations/${opId}/`, data);
  return response.data;
}

export async function deleteOperation(sessionId: string, opId: string): Promise<void> {
  await api.delete(`/editor/sessions/${sessionId}/operations/${opId}/`);
}

export async function saveSession(sessionId: string): Promise<Blob> {
  const response = await api.post(`/editor/sessions/${sessionId}/save/`, {}, {
    responseType: 'blob',
  });
  return response.data;
}

// Existing text editing
export interface TextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  font_size: number;
  font_name: string;
  font_color: string;
  bold: boolean;
  italic: boolean;
  origin_y: number | null;
  page_width: number;
  page_height: number;
}

export interface TextModification {
  page: number;
  original_text: string;
  new_text: string;
  x: number;
  y: number;
  x2: number;
  y2: number;
  font_size: number;
  font_color: string;
  bold: boolean;
  italic: boolean;
  origin_y?: number | null;
}

export async function getTextBlocks(docId: string, pageNum: number): Promise<TextBlock[]> {
  const response = await api.get(`/editor/text-blocks/${docId}/${pageNum}/`);
  return response.data.blocks;
}

export async function modifyText(docId: string, modifications: TextModification[]): Promise<Blob> {
  const response = await api.post(`/editor/text-modify/${docId}/`, { modifications }, {
    responseType: 'blob',
  });
  return response.data;
}
