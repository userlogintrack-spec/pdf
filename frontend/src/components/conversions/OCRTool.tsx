import { useState, useCallback } from 'react';
import { ScanSearch, Loader2 } from 'lucide-react';
import { ocrPdf } from '../../api/conversions';
import FileUpload from '../common/FileUpload';
import ToolLayout from '../tools/ToolLayout';
import type { DocumentInfo } from '../../types/api';

const languages = [
  { code: 'eng', label: 'English' },
  { code: 'hin', label: 'Hindi' },
  { code: 'fra', label: 'French' },
  { code: 'deu', label: 'German' },
  { code: 'spa', label: 'Spanish' },
  { code: 'ita', label: 'Italian' },
  { code: 'por', label: 'Portuguese' },
  { code: 'rus', label: 'Russian' },
  { code: 'jpn', label: 'Japanese' },
  { code: 'kor', label: 'Korean' },
  { code: 'chi_sim', label: 'Chinese (Simplified)' },
  { code: 'ara', label: 'Arabic' },
];

export default function OCRTool() {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [language, setLanguage] = useState('eng');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleUpload = useCallback(async (docId: string) => {
    const { getDocument } = await import('../../api/documents');
    const doc = await getDocument(docId);
    setDocument(doc);
  }, []);

  const handleOCR = async () => {
    if (!document) return;
    setProcessing(true);
    setError(null);
    try {
      await ocrPdf(document.id, language, document.original_filename);
      setDone(true);
    } catch {
      setError('OCR failed. Make sure Tesseract is installed on the server.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="OCR - Text Recognition"
      description="Make scanned PDFs searchable by recognizing text in images."
      icon={<ScanSearch size={20} />}
    >
      {done ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">OCR Complete!</h2>
          <p className="text-gray-600 mb-6">Your searchable PDF has been downloaded.</p>
          <button
            onClick={() => { setDone(false); setDocument(null); }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            Process Another File
          </button>
        </div>
      ) : !document ? (
        <FileUpload onUploadComplete={handleUpload} />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <p className="font-medium text-gray-900">{document.original_filename}</p>
            <p className="text-sm text-gray-500">{document.page_count} pages</p>
          </div>

          {/* Language selector */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Document Language</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-2 text-sm rounded-lg border cursor-pointer transition-colors ${
                    language === lang.code
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              OCR will add an invisible text layer to your scanned PDF, making it searchable
              and allowing you to select/copy text. The visual appearance won't change.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <button
            onClick={handleOCR}
            disabled={processing}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {processing ? (
              <><Loader2 size={18} className="animate-spin" /> Running OCR...</>
            ) : (
              <><ScanSearch size={18} /> Start OCR</>
            )}
          </button>
        </>
      )}
    </ToolLayout>
  );
}
