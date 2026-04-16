import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileType, FileSpreadsheet, Image, FileUp, Loader2,
  Presentation, FileText, Table,
  ImageDown, Minimize2, Eye,
} from 'lucide-react';
import {
  requestPreview, requestPreviewMultipart, downloadByToken,
} from '../../api/conversions';
import type { GenericPreview } from '../../api/conversions';
import FileUpload from '../common/FileUpload';
import ToolLayout from '../tools/ToolLayout';
import PreviewModal from '../common/PreviewModal';
import type { DocumentInfo } from '../../types/api';
import { useDropzone } from 'react-dropzone';

type ConvType =
  | 'pdf-to-word' | 'pdf-to-excel' | 'pdf-to-image' | 'pdf-to-ppt'
  | 'pdf-to-text' | 'pdf-to-csv'
  | 'word-to-pdf' | 'excel-to-pdf' | 'image-to-pdf' | 'ppt-to-pdf'
  | 'text-to-pdf' | 'csv-to-pdf'
  | 'word-to-image' | 'word-to-text'
  | 'image-format-convert' | 'image-compress';

// Endpoint slug mapping for convType
const endpointFor: Record<ConvType, string> = {
  'pdf-to-word':   '/convert/pdf-to-word/',
  'pdf-to-excel':  '/convert/pdf-to-excel/',
  'pdf-to-image':  '/convert/pdf-to-image/',
  'pdf-to-ppt':    '/convert/pdf-to-ppt/',
  'pdf-to-text':   '/convert/pdf-to-text/',
  'pdf-to-csv':    '/convert/pdf-to-csv/',
  'word-to-pdf':   '/convert/word-to-pdf/',
  'excel-to-pdf':  '/convert/excel-to-pdf/',
  'image-to-pdf':  '/convert/image-to-pdf/',
  'ppt-to-pdf':    '/convert/ppt-to-pdf/',
  'text-to-pdf':   '/convert/text-to-pdf/',
  'csv-to-pdf':    '/convert/csv-to-pdf/',
  'word-to-image': '/convert/word-to-image/',
  'word-to-text':  '/convert/word-to-text/',
  'image-format-convert': '/convert/image-convert/',
  'image-compress':       '/convert/image-compress/',
};

// Configuration for each conversion type
const conversionConfig: Record<string, {
  title: string;
  description: string;
  icon: React.ReactNode;
  direction: 'from-pdf' | 'to-pdf' | 'from-word' | 'image-tool';
  accept: Record<string, string[]>;
  acceptLabel: string;
}> = {
  // ===== PDF to other formats =====
  'pdf-to-word': {
    title: 'PDF to Word',
    description: 'Convert your PDF to an editable Word document (.docx)',
    icon: <FileType size={20} />,
    direction: 'from-pdf',
    accept: { 'application/pdf': ['.pdf'] },
    acceptLabel: 'PDF',
  },
  'pdf-to-excel': {
    title: 'PDF to Excel',
    description: 'Extract tables from PDF into Excel spreadsheet (.xlsx)',
    icon: <FileSpreadsheet size={20} />,
    direction: 'from-pdf',
    accept: { 'application/pdf': ['.pdf'] },
    acceptLabel: 'PDF',
  },
  'pdf-to-image': {
    title: 'PDF to Image',
    description: 'Convert PDF pages to high-quality images (PNG or JPEG)',
    icon: <Image size={20} />,
    direction: 'from-pdf',
    accept: { 'application/pdf': ['.pdf'] },
    acceptLabel: 'PDF',
  },
  'pdf-to-ppt': {
    title: 'PDF to PowerPoint',
    description: 'Convert your PDF to an editable PowerPoint presentation (.pptx)',
    icon: <Presentation size={20} />,
    direction: 'from-pdf',
    accept: { 'application/pdf': ['.pdf'] },
    acceptLabel: 'PDF',
  },
  'pdf-to-text': {
    title: 'PDF to Text',
    description: 'Extract all text from your PDF into a plain text file (.txt)',
    icon: <FileText size={20} />,
    direction: 'from-pdf',
    accept: { 'application/pdf': ['.pdf'] },
    acceptLabel: 'PDF',
  },
  'pdf-to-csv': {
    title: 'PDF to CSV',
    description: 'Extract tables from PDF into CSV format',
    icon: <Table size={20} />,
    direction: 'from-pdf',
    accept: { 'application/pdf': ['.pdf'] },
    acceptLabel: 'PDF',
  },

  // ===== Other formats to PDF =====
  'word-to-pdf': {
    title: 'Word to PDF',
    description: 'Convert Word document (.docx) to PDF',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    acceptLabel: 'DOCX',
  },
  'excel-to-pdf': {
    title: 'Excel to PDF',
    description: 'Convert Excel spreadsheet (.xlsx) to PDF',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    acceptLabel: 'XLSX',
  },
  'image-to-pdf': {
    title: 'Image to PDF',
    description: 'Convert images (PNG, JPEG) to a PDF document',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    acceptLabel: 'Images',
  },
  'ppt-to-pdf': {
    title: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentation (.pptx) to PDF',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
    acceptLabel: 'PPTX',
  },
  'text-to-pdf': {
    title: 'Text to PDF',
    description: 'Convert plain text file (.txt) to PDF',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'text/plain': ['.txt'] },
    acceptLabel: 'TXT',
  },
  'csv-to-pdf': {
    title: 'CSV to PDF',
    description: 'Convert CSV file to a formatted PDF table',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'text/csv': ['.csv'] },
    acceptLabel: 'CSV',
  },

  // ===== Word conversions =====
  'word-to-image': {
    title: 'Word to Image',
    description: 'Convert Word document pages to images (PNG or JPEG)',
    icon: <ImageDown size={20} />,
    direction: 'from-word',
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    acceptLabel: 'DOCX',
  },
  'word-to-text': {
    title: 'Word to Text',
    description: 'Extract all text from Word document to plain text',
    icon: <FileText size={20} />,
    direction: 'from-word',
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    acceptLabel: 'DOCX',
  },

  // ===== Image tools =====
  'image-format-convert': {
    title: 'Image Format Converter',
    description: 'Convert between PNG, JPG, WebP, BMP, GIF, TIFF',
    icon: <Image size={20} />,
    direction: 'image-tool',
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff'] },
    acceptLabel: 'Images',
  },
  'image-compress': {
    title: 'Compress Image',
    description: 'Reduce image file size with adjustable quality',
    icon: <Minimize2 size={20} />,
    direction: 'image-tool',
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    acceptLabel: 'Images',
  },
};

export default function ConversionTool() {
  const { convType } = useParams<{ convType: string }>();
  const config = conversionConfig[convType || ''];

  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GenericPreview | null>(null);

  // Image-specific options
  const [imageFormat, setImageFormat] = useState('png');
  const [imageDpi, setImageDpi] = useState(200);

  // Image convert options
  const [targetImageFormat, setTargetImageFormat] = useState('png');

  // Image compress options
  const [compressQuality, setCompressQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState('');
  const [maxHeight, setMaxHeight] = useState('');

  const endpoint = convType ? endpointFor[convType as ConvType] : null;

  // For to-pdf and from-word conversions (direct file upload)
  const onDropFile = useCallback(async (acceptedFiles: File[]) => {
    if (!config || !endpoint || acceptedFiles.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const fd = new FormData();
      // Multi-file for image-to-pdf, single file everywhere else
      if (convType === 'image-to-pdf') {
        acceptedFiles.forEach((f) => fd.append('files', f));
      } else {
        fd.append('file', acceptedFiles[0]);
      }
      if (convType === 'word-to-image') {
        fd.append('format', imageFormat);
        fd.append('dpi', String(imageDpi));
      } else if (convType === 'image-format-convert') {
        fd.append('format', targetImageFormat);
      } else if (convType === 'image-compress') {
        fd.append('quality', String(compressQuality));
        if (maxWidth)  fd.append('max_width',  maxWidth);
        if (maxHeight) fd.append('max_height', maxHeight);
      }
      const result = await requestPreviewMultipart(endpoint, fd);
      setPreview(result);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [config, endpoint, convType, imageFormat, imageDpi, targetImageFormat, compressQuality, maxWidth, maxHeight]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    accept: config?.accept,
    disabled: processing,
  });

  // For from-pdf conversions
  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
  }, []);

  const handleConvert = async () => {
    if (!document || !endpoint) return;
    setProcessing(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { document_id: document.id };
      if (convType === 'pdf-to-image') {
        body.format = imageFormat;
        body.dpi = imageDpi;
      }
      const result = await requestPreview(endpoint, body);
      setPreview(result);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    await downloadByToken(preview.download_url, preview.filename);
  };

  const closePreview = () => setPreview(null);

  const resetAll = () => {
    setPreview(null);
    setDocument(null);
    setError(null);
  };

  if (!config) {
    return <div className="p-8 text-center text-gray-500">Unknown conversion type</div>;
  }

  const showDirectUpload = config.direction !== 'from-pdf';

  return (
    <ToolLayout title={config.title} description={config.description} icon={config.icon}>
      <PreviewModal
        open={!!preview}
        onClose={closePreview}
        onBackToOptions={resetAll}
        onDownload={handleDownload}
        data={preview}
        title={`Preview: ${config.title}`}
      />
      {showDirectUpload ? (
        /* Direct file upload conversions */
        <div className="space-y-6">
          {/* Options before upload for specific tools */}
          {convType === 'image-format-convert' && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Convert to format</label>
              <div className="flex flex-wrap gap-2">
                {['png', 'jpeg', 'webp', 'bmp', 'gif', 'tiff'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTargetImageFormat(f)}
                    className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${
                      targetImageFormat === f
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {convType === 'image-compress' && (
            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality: {compressQuality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={compressQuality}
                  onChange={(e) => setCompressQuality(Number(e.target.value))}
                  className="w-full"
                  title="Compression quality"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>10% (Small)</span>
                  <span>50% (Medium)</span>
                  <span>100% (Original)</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Width (px)</label>
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(e.target.value)}
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Height (px)</label>
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(e.target.value)}
                    placeholder="No limit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {(convType === 'word-to-image') && (
            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <div className="flex gap-3">
                  {['png', 'jpeg'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setImageFormat(f)}
                      className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${
                        imageFormat === f
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-600'
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality (DPI): {imageDpi}
                </label>
                <input
                  type="range"
                  min="72"
                  max="600"
                  step="50"
                  value={imageDpi}
                  onChange={(e) => setImageDpi(Number(e.target.value))}
                  className="w-full"
                  title="Image DPI quality"
                />
              </div>
            </div>
          )}

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            <input {...getInputProps()} />
            {processing ? (
              <>
                <Loader2 size={40} className="mx-auto text-indigo-500 animate-spin mb-4" />
                <p className="text-lg text-gray-700">Generating preview…</p>
              </>
            ) : (
              <>
                <FileUp size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-700 mb-1">
                  Drop your {config.acceptLabel} file{convType === 'image-to-pdf' ? 's' : ''} here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
            )}
          </div>
        </div>
      ) : (
        /* From-PDF: upload PDF then convert */
        <>
          {!document ? (
            <FileUpload onUploadComplete={handleUpload} />
          ) : (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <p className="font-medium text-gray-900">{document.original_filename}</p>
                <p className="text-sm text-gray-500">{document.page_count} pages</p>
              </div>

              {/* Image-specific options */}
              {convType === 'pdf-to-image' && (
                <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <div className="flex gap-3">
                      {['png', 'jpeg'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setImageFormat(f)}
                          className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${
                            imageFormat === f
                              ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                              : 'bg-white border-gray-300 text-gray-600'
                          }`}
                        >
                          {f.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality (DPI): {imageDpi}
                    </label>
                    <input
                      type="range"
                      min="72"
                      max="600"
                      step="50"
                      value={imageDpi}
                      onChange={(e) => setImageDpi(Number(e.target.value))}
                      className="w-full"
                      title="Image DPI quality"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>72 (Low)</span>
                      <span>300 (Print)</span>
                      <span>600 (High)</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
              )}

              <button
                onClick={handleConvert}
                disabled={processing}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                {processing ? (
                  <><Loader2 size={18} className="animate-spin" /> Generating preview…</>
                ) : (
                  <><Eye size={18} /> Preview before download</>
                )}
              </button>
            </>
          )}
        </>
      )}
    </ToolLayout>
  );
}
