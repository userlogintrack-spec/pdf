import { getThumbnailUrl } from '../../api/documents';
import { useEditorStore } from '../../store/useEditorStore';

interface PageThumbnailsProps {
  documentId: string;
  pageCount: number;
}

export default function PageThumbnails({ documentId, pageCount }: PageThumbnailsProps) {
  const { currentPage, setCurrentPage } = useEditorStore();

  return (
    <div className="w-36 bg-gray-50 border-r border-gray-200 overflow-y-auto p-2 flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">Pages</span>
      {Array.from({ length: pageCount }, (_, i) => (
        <button key={i} type="button" onClick={() => setCurrentPage(i)}
          className={`relative rounded-md overflow-hidden cursor-pointer transition-all border-2 ${
            currentPage === i ? 'border-indigo-500 shadow-sm' : 'border-transparent hover:border-gray-300'
          }`}>
          <img src={getThumbnailUrl(documentId, i)} alt={`Page ${i + 1}`}
            className="w-full block" loading="lazy" />
          <span className="absolute bottom-1 right-1 bg-gray-900/70 text-white text-[9px] px-1 py-0.5 rounded font-medium">
            {i + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
