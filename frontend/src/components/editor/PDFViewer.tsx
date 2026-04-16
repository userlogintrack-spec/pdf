import { useEffect, useRef, useState, useCallback } from 'react';
import { getPageImageUrl } from '../../api/documents';
import { useEditorStore } from '../../store/useEditorStore';
import CanvasOverlay from './CanvasOverlay';
import TextOverlay from './TextOverlay';

interface PDFViewerProps {
  documentId: string;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
}

export default function PDFViewer({ documentId, pageCount, pageWidth, pageHeight }: PDFViewerProps) {
  const { currentPage, zoom, setTotalPages, activeTool } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageVersion, setImageVersion] = useState(0);

  const displayWidth = 800;
  const displayHeight = Math.round((pageHeight / pageWidth) * displayWidth);

  useEffect(() => {
    setTotalPages(pageCount);
  }, [pageCount, setTotalPages]);

  // Force re-render page image after text modification
  const handleTextModified = useCallback(() => {
    setImageVersion(Date.now());
  }, []);

  const baseUrl = getPageImageUrl(documentId, currentPage, displayWidth);
  const separator = baseUrl.includes('?') ? '&' : '?';
  const pageUrl = `${baseUrl}${separator}_t=${imageVersion}`;

  // Show canvas overlay only when using drawing/adding tools
  const showCanvas = activeTool !== 'select';

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto flex items-start justify-center p-6"
      style={{ background: '#f3f4f6' }}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          position: 'relative',
        }}
        className="shadow-2xl rounded-sm"
      >
        {/* PDF page image */}
        <img
          src={pageUrl}
          alt={`Page ${currentPage + 1}`}
          className="absolute inset-0 w-full h-full"
          draggable={false}
        />

        {/* Text overlay for editing existing text (select mode) */}
        <TextOverlay
          documentId={documentId}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
          onTextModified={handleTextModified}
        />

        {/* Fabric.js canvas for adding new objects (non-select modes) */}
        {showCanvas && (
          <CanvasOverlay width={displayWidth} height={displayHeight} />
        )}

        {/* Page badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-900/70 text-white">
            {currentPage + 1} / {pageCount}
          </span>
        </div>
      </div>
    </div>
  );
}
