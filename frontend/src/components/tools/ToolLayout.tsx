import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function ToolLayout({ title, description, icon, children }: ToolLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 no-underline mb-6">
        <ArrowLeft size={15} /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <p className="text-gray-500 mb-6 ml-13 text-sm">{description}</p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {children}
      </div>
    </div>
  );
}
