import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <FileText size={15} className="text-white" />
              </div>
              <span className="text-white font-bold">PDFCraft</span>
            </div>
            <p className="text-sm leading-relaxed">
              Professional PDF editing tools for businesses. Edit, convert, and manage PDFs online.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">PDF Tools</h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li><Link to="/editor" className="hover:text-white transition-colors no-underline text-gray-400">Edit PDF</Link></li>
              <li><Link to="/tools/merge" className="hover:text-white transition-colors no-underline text-gray-400">Merge PDF</Link></li>
              <li><Link to="/tools/split" className="hover:text-white transition-colors no-underline text-gray-400">Split PDF</Link></li>
              <li><Link to="/tools/compress" className="hover:text-white transition-colors no-underline text-gray-400">Compress PDF</Link></li>
              <li><Link to="/tools/rotate" className="hover:text-white transition-colors no-underline text-gray-400">Rotate PDF</Link></li>
            </ul>
          </div>

          {/* Convert */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Convert</h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li><Link to="/convert/pdf-to-word" className="hover:text-white transition-colors no-underline text-gray-400">PDF to Word</Link></li>
              <li><Link to="/convert/pdf-to-excel" className="hover:text-white transition-colors no-underline text-gray-400">PDF to Excel</Link></li>
              <li><Link to="/convert/pdf-to-image" className="hover:text-white transition-colors no-underline text-gray-400">PDF to Image</Link></li>
              <li><Link to="/convert/word-to-pdf" className="hover:text-white transition-colors no-underline text-gray-400">Word to PDF</Link></li>
              <li><Link to="/convert/ocr" className="hover:text-white transition-colors no-underline text-gray-400">OCR</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              <li><span className="text-gray-400">About Us</span></li>
              <li><span className="text-gray-400">Privacy Policy</span></li>
              <li><span className="text-gray-400">Terms of Service</span></li>
              <li><span className="text-gray-400">Contact</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">&copy; {new Date().getFullYear()} PDFCraft. All rights reserved.</p>
          <p className="text-xs text-gray-500">Your files are processed securely and deleted automatically.</p>
        </div>
      </div>
    </footer>
  );
}
