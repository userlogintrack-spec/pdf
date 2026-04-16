import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Merge, Upload, X, GripVertical, Loader2, Eye } from 'lucide-react';
import { uploadDocument } from '../../api/documents';
import { requestPreview, downloadByToken } from '../../api/conversions';
import type { GenericPreview } from '../../api/conversions';
import ToolLayout from './ToolLayout';
import PreviewModal from '../common/PreviewModal';

interface UploadedFile {
  id: string;
  name: string;
  pages: number;
  size: number;
}

export default function MergeTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<GenericPreview | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);
    try {
      for (const file of acceptedFiles) {
        const doc = await uploadDocument(file);
        setFiles((prev) => [...prev, {
          id: doc.id,
          name: doc.original_filename,
          pages: doc.page_count,
          size: doc.file_size,
        }]);
      }
    } catch {
      setError('Failed to upload one or more files.');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: uploading,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError(null);
    try {
      const result = await requestPreview('/tools/merge/', {
        document_ids: files.map((f) => f.id),
      });
      setPreview(result);
    } catch {
      setError('Merge failed. Please try again.');
    } finally {
      setMerging(false);
    }
  };

  const handleDownload = async () => {
    if (!preview) return;
    await downloadByToken(preview.download_url, preview.filename);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one. Drag to reorder."
      icon={<Merge size={20} />}
    >
      <PreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        onBackToOptions={() => setPreview(null)}
        onDownload={handleDownload}
        data={preview}
        title="Preview merged PDF"
      />

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 size={32} className="mx-auto text-indigo-500 animate-spin mb-2" />
        ) : (
          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
        )}
        <p className="text-gray-600">{uploading ? 'Uploading...' : 'Drop PDF files here or click to browse'}</p>
        <p className="text-xs text-gray-400 mt-1">You can select multiple files</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 mb-6">
          {files.map((file, index) => (
            <div
              key={file.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow ${
                dragIndex === index ? 'opacity-50' : ''
              }`}
            >
              <GripVertical size={16} className="text-gray-400 cursor-grab" />
              <span className="text-sm font-medium text-indigo-600 w-6">{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{file.pages} pages · {formatSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Merge Button */}
      <button
        onClick={handleMerge}
        disabled={files.length < 2 || merging}
        className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 transition-all"
      >
        {merging ? (
          <><Loader2 size={18} className="animate-spin" /> Merging…</>
        ) : (
          <><Eye size={18} /> Preview merged PDF</>
        )}
      </button>
    </ToolLayout>
  );
}
