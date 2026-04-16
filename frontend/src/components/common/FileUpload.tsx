import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useDocumentStore } from '../../store/useDocumentStore';
import { useNavigate } from 'react-router-dom';

interface FileUploadProps {
  onUploadComplete?: (docId: string) => void;
  compact?: boolean;
}

export default function FileUpload({ onUploadComplete, compact }: FileUploadProps) {
  const { uploadDocument, isUploading, error } = useDocumentStore();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    try {
      const doc = await uploadDocument(acceptedFiles[0]);
      if (onUploadComplete) onUploadComplete(doc.id);
      else navigate(`/editor/${doc.id}`);
    } catch { /* handled in store */ }
  }, [uploadDocument, onUploadComplete, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, disabled: isUploading,
  });

  if (compact) {
    return (
      <div {...getRootProps()}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${isDragActive ? 'bg-indigo-50 border-indigo-300' : ''}`}>
        <input {...getInputProps()} />
        {isUploading ? <Loader2 size={16} className="animate-spin text-indigo-600" /> : <Upload size={16} className="text-gray-500" />}
        <span className="text-sm text-gray-600">{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div {...getRootProps()}
        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
        } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
        <input {...getInputProps()} />
        {isUploading ? (
          <>
            <Loader2 size={40} className="text-indigo-600 animate-spin mb-3" />
            <p className="text-gray-700 font-medium">Uploading...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
              {isDragActive ? <FileText size={28} className="text-white" /> : <Upload size={28} className="text-white" />}
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1">
              {isDragActive ? 'Drop your PDF here' : 'Upload your PDF'}
            </p>
            <p className="text-sm text-gray-500 mb-4">Drag & drop or click to browse</p>
            <button type="button" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Select file
            </button>
            <p className="text-xs text-gray-400 mt-3">Max 200MB per file</p>
          </>
        )}
      </div>
      {error && <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
    </div>
  );
}
