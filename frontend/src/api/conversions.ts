import api from './client';

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

// ===== Generic preview envelope (returned by any endpoint with preview=true) =====

export interface PreviewPageInfo {
  index: number;
  page_num: number;
  thumbnail_url: string;
  preview_url: string;
}

export interface GenericPreview {
  token: string;
  download_url: string;
  filename: string;
  file_size: number;
  page_count: number;
  expires_in: number;
  preview_pages: PreviewPageInfo[];
  [key: string]: unknown; // extra_meta fields (compressed_size, mode, etc.)
}

export async function requestPreview(
  endpoint: string,
  body: Record<string, unknown>,
): Promise<GenericPreview> {
  const response = await api.post<GenericPreview>(endpoint, { ...body, preview: true });
  return response.data;
}

export async function requestPreviewMultipart(
  endpoint: string,
  formData: FormData,
): Promise<GenericPreview> {
  formData.append('preview', 'true');
  const response = await api.post<GenericPreview>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// ===== PDF to other formats =====

export async function pdfToWord(documentId: string, filename: string): Promise<void> {
  const response = await api.post('/convert/pdf-to-word/', { document_id: documentId }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '.docx');
  triggerDownload(response.data, name);
}

export async function pdfToExcel(documentId: string, filename: string): Promise<void> {
  const response = await api.post('/convert/pdf-to-excel/', { document_id: documentId }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '.xlsx');
  triggerDownload(response.data, name);
}

export async function pdfToImage(documentId: string, options: { format: string; dpi: number }): Promise<void> {
  const response = await api.post('/convert/pdf-to-image/', { document_id: documentId, ...options }, { responseType: 'blob' });
  const contentType = response.headers['content-type'];
  const ext = contentType?.includes('zip') ? 'zip' : options.format === 'jpeg' ? 'jpg' : 'png';
  triggerDownload(response.data, `pdf_images.${ext}`);
}

export async function pdfToPpt(
  documentId: string,
  filename: string,
  options?: { mode?: 'image' | 'editable' | 'hybrid'; dpi?: number }
): Promise<void> {
  const response = await api.post('/convert/pdf-to-ppt/', {
    document_id: documentId,
    mode: options?.mode || 'hybrid',
    dpi: options?.dpi || 250,
  }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '.pptx');
  triggerDownload(response.data, name);
}

export interface PdfToPptPreview {
  token: string;
  download_url: string;
  filename: string;
  file_size: number;
  slide_count: number;
  mode: 'image' | 'editable' | 'hybrid';
  dpi: number;
  expires_in: number;
  preview_pages: {
    index: number;
    page_num: number;
    thumbnail_url: string;
    preview_url: string;
  }[];
}

export async function pdfToPptPreview(
  documentId: string,
  options?: { mode?: 'image' | 'editable' | 'hybrid'; dpi?: number }
): Promise<PdfToPptPreview> {
  const response = await api.post<PdfToPptPreview>('/convert/pdf-to-ppt/', {
    document_id: documentId,
    mode: options?.mode || 'image',
    dpi: options?.dpi || 250,
    preview: true,
  });
  return response.data;
}

export async function downloadByToken(downloadUrl: string, filename: string): Promise<void> {
  const response = await api.get(downloadUrl.replace(/^\/api\/v1/, ''), { responseType: 'blob' });
  triggerDownload(response.data, filename);
}

export async function pdfToText(documentId: string, filename: string): Promise<void> {
  const response = await api.post('/convert/pdf-to-text/', { document_id: documentId }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '.txt');
  triggerDownload(response.data, name);
}

export async function pdfToHtml(documentId: string, filename: string): Promise<void> {
  const response = await api.post('/convert/pdf-to-html/', { document_id: documentId }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '.html');
  triggerDownload(response.data, name);
}

export async function pdfToCsv(documentId: string, filename: string): Promise<void> {
  const response = await api.post('/convert/pdf-to-csv/', { document_id: documentId }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '.csv');
  triggerDownload(response.data, name);
}

// ===== Other formats to PDF =====

export async function wordToPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/word-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.docx?$/i, '.pdf');
  triggerDownload(response.data, name);
}

export async function excelToPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/excel-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.xlsx?$/i, '.pdf');
  triggerDownload(response.data, name);
}

export async function imageToPdf(files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));
  const response = await api.post('/convert/image-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  triggerDownload(response.data, 'converted.pdf');
}

export async function pptToPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/ppt-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.pptx?$/i, '.pdf');
  triggerDownload(response.data, name);
}

export async function htmlToPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/html-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.html?$/i, '.pdf');
  triggerDownload(response.data, name);
}

export async function textToPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/text-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.txt$/i, '.pdf');
  triggerDownload(response.data, name);
}

export async function csvToPdf(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/csv-to-pdf/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.csv$/i, '.pdf');
  triggerDownload(response.data, name);
}

// ===== Word conversions =====

export async function wordToImage(file: File, options: { format: string; dpi: number }): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', options.format);
  formData.append('dpi', String(options.dpi));
  const response = await api.post('/convert/word-to-image/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const contentType = response.headers['content-type'];
  const ext = contentType?.includes('zip') ? 'zip' : options.format === 'jpeg' ? 'jpg' : 'png';
  const name = file.name.replace(/\.docx?$/i, `.${ext}`);
  triggerDownload(response.data, name);
}

export async function wordToHtml(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/word-to-html/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.docx?$/i, '.html');
  triggerDownload(response.data, name);
}

export async function wordToText(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/convert/word-to-text/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.docx?$/i, '.txt');
  triggerDownload(response.data, name);
}

// ===== Image conversions =====

export async function imageFormatConvert(file: File, targetFormat: string): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', targetFormat);
  const response = await api.post('/convert/image-convert/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const name = file.name.replace(/\.[^.]+$/, `.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`);
  triggerDownload(response.data, name);
}

export async function imageCompress(file: File, options: { quality: number; maxWidth?: number; maxHeight?: number }): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('quality', String(options.quality));
  if (options.maxWidth) formData.append('max_width', String(options.maxWidth));
  if (options.maxHeight) formData.append('max_height', String(options.maxHeight));
  const response = await api.post('/convert/image-compress/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  const ext = response.headers['content-type']?.includes('png') ? 'png' : 'jpg';
  const name = file.name.replace(/\.[^.]+$/, `_compressed.${ext}`);
  triggerDownload(response.data, name);
}

// ===== OCR =====

export async function ocrPdf(documentId: string, language: string, filename: string): Promise<void> {
  const response = await api.post('/convert/ocr/', { document_id: documentId, language }, { responseType: 'blob' });
  const name = filename.replace(/\.pdf$/i, '_ocr.pdf');
  triggerDownload(response.data, name);
}
