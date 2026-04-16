import api from './client';

async function downloadBlob(url: string, data: Record<string, unknown>, filename: string): Promise<Blob> {
  const response = await api.post(url, data, { responseType: 'blob' });
  return response.data;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function mergePDFs(documentIds: string[]): Promise<void> {
  const blob = await downloadBlob('/tools/merge/', { document_ids: documentIds }, 'merged.pdf');
  triggerDownload(blob, 'merged.pdf');
}

export async function splitPDF(documentId: string, ranges: string[]): Promise<void> {
  const blob = await downloadBlob('/tools/split/', { document_id: documentId, ranges }, 'split.pdf');
  triggerDownload(blob, 'split.pdf');
}

export async function rotatePDF(documentId: string, pages: Record<number, number>): Promise<void> {
  const blob = await downloadBlob('/tools/rotate/', { document_id: documentId, pages }, 'rotated.pdf');
  triggerDownload(blob, 'rotated.pdf');
}

export async function reorderPDF(documentId: string, newOrder: number[]): Promise<void> {
  const blob = await downloadBlob('/tools/reorder/', { document_id: documentId, new_order: newOrder }, 'reordered.pdf');
  triggerDownload(blob, 'reordered.pdf');
}

export async function extractPages(documentId: string, pages: number[]): Promise<void> {
  const blob = await downloadBlob('/tools/extract/', { document_id: documentId, pages }, 'extracted.pdf');
  triggerDownload(blob, 'extracted.pdf');
}

export async function compressPDF(documentId: string, quality: string): Promise<{ blob: Blob; ratio: string }> {
  const response = await api.post('/tools/compress/', { document_id: documentId, quality }, { responseType: 'blob' });
  const ratio = response.headers['x-compression-ratio'] || '0';
  return { blob: response.data, ratio };
}

export async function addWatermark(documentId: string, options: {
  text: string;
  font_size: number;
  color: string;
  opacity: number;
  rotation: number;
  position: string;
}): Promise<void> {
  const blob = await downloadBlob('/tools/watermark/', { document_id: documentId, ...options }, 'watermarked.pdf');
  triggerDownload(blob, 'watermarked.pdf');
}
