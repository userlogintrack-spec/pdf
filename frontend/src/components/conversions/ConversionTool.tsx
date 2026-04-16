import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  FileType, FileSpreadsheet, Image, FileUp, Loader2,
  Presentation, FileText, Code, Table,
  ImageDown, Minimize2,
} from 'lucide-react';
import { uploadDocument } from '../../api/documents';
import {
  pdfToWord, pdfToExcel, pdfToImage, pdfToPpt, pdfToText, pdfToHtml, pdfToCsv,
  wordToPdf, excelToPdf, imageToPdf, pptToPdf, htmlToPdf, textToPdf, csvToPdf,
  wordToImage, wordToHtml, wordToText,
  imageFormatConvert, imageCompress,
} from '../../api/conversions';
import FileUpload from '../common/FileUpload';
import ToolLayout from '../tools/ToolLayout';
import type { DocumentInfo } from '../../types/api';
import { useDropzone } from 'react-dropzone';

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
  'pdf-to-html': {
    title: 'PDF to HTML',
    description: 'Convert PDF to HTML with formatting preserved',
    icon: <Code size={20} />,
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
  'html-to-pdf': {
    title: 'HTML to PDF',
    description: 'Convert HTML file to PDF document',
    icon: <FileUp size={20} />,
    direction: 'to-pdf',
    accept: { 'text/html': ['.html', '.htm'] },
    acceptLabel: 'HTML',
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
  'word-to-html': {
    title: 'Word to HTML',
    description: 'Convert Word document to HTML with formatting',
    icon: <Code size={20} />,
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
  const [done, setDone] = useState(false);

  // Image-specific options
  const [imageFormat, setImageFormat] = useState('png');
  const [imageDpi, setImageDpi] = useState(200);

  // Image convert options
  const [targetImageFormat, setTargetImageFormat] = useState('png');

  // Image compress options
  const [compressQuality, setCompressQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState('');
  const [maxHeight, setMaxHeight] = useState('');

  // For to-pdf and from-word conversions (direct file upload)
  const onDropFile = useCallback(async (acceptedFiles: File[]) => {
    if (!config || acceptedFiles.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      switch (convType) {
        // To PDF
        case 'word-to-pdf': await wordToPdf(acceptedFiles[0]); break;
        case 'excel-to-pdf': await excelToPdf(acceptedFiles[0]); break;
        case 'image-to-pdf': await imageToPdf(acceptedFiles); break;
        case 'ppt-to-pdf': await pptToPdf(acceptedFiles[0]); break;
        case 'html-to-pdf': await htmlToPdf(acceptedFiles[0]); break;
        case 'text-to-pdf': await textToPdf(acceptedFiles[0]); break;
        case 'csv-to-pdf': await csvToPdf(acceptedFiles[0]); break;
        // Word conversions
        case 'word-to-image': await wordToImage(acceptedFiles[0], { format: imageFormat, dpi: imageDpi }); break;
        case 'word-to-html': await wordToHtml(acceptedFiles[0]); break;
        case 'word-to-text': await wordToText(acceptedFiles[0]); break;
        // Image tools
        case 'image-format-convert': await imageFormatConvert(acceptedFiles[0], targetImageFormat); break;
        case 'image-compress': await imageCompress(acceptedFiles[0], {
          quality: compressQuality,
          maxWidth: maxWidth ? parseInt(maxWidth) : undefined,
          maxHeight: maxHeight ? parseInt(maxHeight) : undefined,
        }); break;
      }
      setDone(true);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [config, convType, imageFormat, imageDpi, targetImageFormat, compressQuality, maxWidth, maxHeight]);

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
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      switch (convType) {
        case 'pdf-to-word': await pdfToWord(document.id, document.original_filename); break;
        case 'pdf-to-excel': await pdfToExcel(document.id, document.original_filename); break;
        case 'pdf-to-image': await pdfToImage(document.id, { format: imageFormat, dpi: imageDpi }); break;
        case 'pdf-to-ppt': await pdfToPpt(document.id, document.original_filename); break;
        case 'pdf-to-text': await pdfToText(document.id, document.original_filename); break;
        case 'pdf-to-html': await pdfToHtml(document.id, document.original_filename); break;
        case 'pdf-to-csv': await pdfToCsv(document.id, document.original_filename); break;
      }
      setDone(true);
    } catch {
      setError('Conversion failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!config) {
    return <div className="p-8 text-center text-gray-500">Unknown conversion type</div>;
  }

  const showDirectUpload = config.direction !== 'from-pdf';

  return (
    <ToolLayout title={config.title} description={config.description} icon={config.icon}>
      {done ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">&#10003;</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversion Complete!</h2>
          <p className="text-gray-600 mb-6">Your file has been downloaded.</p>
          <button
            onClick={() => { setDone(false); setDocument(null); }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            Convert Another File
          </button>
        </div>
      ) : showDirectUpload ? (
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
                <p className="text-lg text-gray-700">Converting...</p>
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
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {processing ? (
                  <><Loader2 size={18} className="animate-spin" /> Converting...</>
                ) : (
                  <>{config.icon} Convert</>
                )}
              </button>
            </>
          )}
        </>
      )}
    </ToolLayout>
  );
}
