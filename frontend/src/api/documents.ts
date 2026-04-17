import api, { API_BASE } from './client';
import type { DocumentInfo, DocumentListItem } from '../types/api';

export async function uploadDocument(file: File): Promise<DocumentInfo> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/documents/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getDocuments(): Promise<DocumentListItem[]> {
  const response = await api.get('/documents/');
  return response.data.results || response.data;
}

export async function getDocument(id: string): Promise<DocumentInfo> {
  const response = await api.get(`/documents/${id}/`);
  return response.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await api.delete(`/documents/${id}/`);
}

export function getPageImageUrl(docId: string, pageNum: number, width?: number): string {
  const params = width ? `?width=${width}` : '';
  return `${API_BASE}/api/v1/documents/${docId}/pages/${pageNum}/image/${params}`;
}

export function getThumbnailUrl(docId: string, pageNum: number): string {
  return `${API_BASE}/api/v1/documents/${docId}/thumbnail/${pageNum}/`;
}
