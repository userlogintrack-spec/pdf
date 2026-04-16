import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  FileText, User, LogOut, ChevronDown, Menu, X, Search,
  Merge, Scissors, RotateCw, ArrowDownUp, FileOutput,
  Minimize2, Droplets, Lock, Unlock, ScanSearch,
  FileType, FileSpreadsheet, Image, Presentation,
  Code, Table, FileUp, ImageDown, ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import SearchDialog from './SearchDialog';

const pdfToolsMenu = [
  { icon: <FileText size={16} />, label: 'Edit PDF', desc: 'Text, images & annotations', href: '/editor', color: 'text-indigo-600' },
  { icon: <Merge size={16} />, label: 'Merge PDF', desc: 'Combine multiple PDFs', href: '/tools/merge', color: 'text-blue-600' },
  { icon: <Scissors size={16} />, label: 'Split PDF', desc: 'Split into multiple files', href: '/tools/split', color: 'text-emerald-600' },
  { icon: <Minimize2 size={16} />, label: 'Compress', desc: 'Reduce file size', href: '/tools/compress', color: 'text-pink-600' },
  { icon: <RotateCw size={16} />, label: 'Rotate', desc: 'Rotate PDF pages', href: '/tools/rotate', color: 'text-orange-600' },
  { icon: <ArrowDownUp size={16} />, label: 'Reorder', desc: 'Rearrange pages', href: '/tools/reorder', color: 'text-violet-600' },
  { icon: <FileOutput size={16} />, label: 'Extract', desc: 'Extract pages', href: '/tools/extract', color: 'text-teal-600' },
  { icon: <Droplets size={16} />, label: 'Watermark', desc: 'Add watermark', href: '/tools/watermark', color: 'text-cyan-600' },
  { icon: <Lock size={16} />, label: 'Protect', desc: 'Password protect', href: '/tools/protect', color: 'text-red-600' },
  { icon: <Unlock size={16} />, label: 'Unlock', desc: 'Remove password', href: '/tools/unlock', color: 'text-amber-600' },
  { icon: <ScanSearch size={16} />, label: 'OCR', desc: 'Recognize scanned text', href: '/convert/ocr', color: 'text-gray-600' },
];

const convertFromPdfMenu = [
  { icon: <FileType size={16} />, label: 'PDF to Word', href: '/convert/pdf-to-word', color: 'text-blue-700' },
  { icon: <FileSpreadsheet size={16} />, label: 'PDF to Excel', href: '/convert/pdf-to-excel', color: 'text-green-700' },
  { icon: <Presentation size={16} />, label: 'PDF to PPT', href: '/convert/pdf-to-ppt', color: 'text-rose-600' },
  { icon: <Image size={16} />, label: 'PDF to Image', href: '/convert/pdf-to-image', color: 'text-purple-600' },
  { icon: <FileText size={16} />, label: 'PDF to Text', href: '/convert/pdf-to-text', color: 'text-slate-600' },
  { icon: <Code size={16} />, label: 'PDF to HTML', href: '/convert/pdf-to-html', color: 'text-orange-600' },
  { icon: <Table size={16} />, label: 'PDF to CSV', href: '/convert/pdf-to-csv', color: 'text-emerald-700' },
];

const convertToPdfMenu = [
  { icon: <FileUp size={16} />, label: 'Word to PDF', href: '/convert/word-to-pdf', color: 'text-blue-600' },
  { icon: <FileUp size={16} />, label: 'Excel to PDF', href: '/convert/excel-to-pdf', color: 'text-green-600' },
  { icon: <FileUp size={16} />, label: 'PPT to PDF', href: '/convert/ppt-to-pdf', color: 'text-rose-500' },
  { icon: <FileUp size={16} />, label: 'Image to PDF', href: '/convert/image-to-pdf', color: 'text-purple-500' },
  { icon: <FileUp size={16} />, label: 'HTML to PDF', href: '/convert/html-to-pdf', color: 'text-orange-500' },
  { icon: <FileUp size={16} />, label: 'Text to PDF', href: '/convert/text-to-pdf', color: 'text-slate-500' },
  { icon: <FileUp size={16} />, label: 'CSV to PDF', href: '/convert/csv-to-pdf', color: 'text-emerald-500' },
];

const otherConversions = [
  { icon: <ImageDown size={16} />, label: 'Word to Image', href: '/convert/word-to-image', color: 'text-violet-600' },
  { icon: <Code size={16} />, label: 'Word to HTML', href: '/convert/word-to-html', color: 'text-cyan-600' },
  { icon: <FileText size={16} />, label: 'Word to Text', href: '/convert/word-to-text', color: 'text-gray-600' },
  { icon: <Image size={16} />, label: 'Image Converter', href: '/convert/image-format-convert', color: 'text-fuchsia-600' },
  { icon: <Minimize2 size={16} />, label: 'Compress Image', href: '/convert/image-compress', color: 'text-pink-600' },
];

type DropdownKey = 'tools' | 'convert' | null;

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();
  const headerRef = useRef<HTMLElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openDropdown = (key: DropdownKey) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const toggleMobileSection = (key: string) => {
    setMobileSection(mobileSection === key ? null : key);
  };

  return (
    <header ref={headerRef} className="bg-white/80 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-indigo-200 group-hover:shadow-md transition-shadow">
              <FileText size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              PDFCraft
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-10">
            {/* PDF Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('tools')}
              onMouseLeave={closeDropdown}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeDropdown === 'tools'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                PDF Tools
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'tools' && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200/80 p-4 w-[420px] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="grid grid-cols-2 gap-0.5">
                      {pdfToolsMenu.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 no-underline transition-colors group/item"
                        >
                          <div className={`mt-0.5 ${item.color}`}>{item.icon}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 group-hover/item:text-indigo-600 transition-colors">{item.label}</div>
                            <div className="text-xs text-gray-400">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link to="/" className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 no-underline rounded-lg hover:bg-indigo-50 transition-colors">
                        View all tools <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Convert Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('convert')}
              onMouseLeave={closeDropdown}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeDropdown === 'convert'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Convert
                <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'convert' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'convert' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200/80 p-5 w-[640px] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="grid grid-cols-3 gap-6">
                      {/* From PDF */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">From PDF</h4>
                        <div className="space-y-0.5">
                          {convertFromPdfMenu.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 no-underline transition-colors group/item"
                            >
                              <span className={item.color}>{item.icon}</span>
                              <span className="text-sm font-medium text-gray-700 group-hover/item:text-indigo-600 transition-colors">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* To PDF */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">To PDF</h4>
                        <div className="space-y-0.5">
                          {convertToPdfMenu.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 no-underline transition-colors group/item"
                            >
                              <span className={item.color}>{item.icon}</span>
                              <span className="text-sm font-medium text-gray-700 group-hover/item:text-indigo-600 transition-colors">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Other */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Word & Image</h4>
                        <div className="space-y-0.5">
                          {otherConversions.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 no-underline transition-colors group/item"
                            >
                              <span className={item.color}>{item.icon}</span>
                              <span className="text-sm font-medium text-gray-700 group-hover/item:text-indigo-600 transition-colors">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <Link to="/tools/merge"
              className={`px-3.5 py-2 text-sm font-medium rounded-lg no-underline transition-colors ${
                location.pathname === '/tools/merge' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              Merge
            </Link>
            <Link to="/tools/compress"
              className={`px-3.5 py-2 text-sm font-medium rounded-lg no-underline transition-colors ${
                location.pathname === '/tools/compress' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>
              Compress
            </Link>
          </nav>

          <div className="flex-1" />

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl cursor-pointer transition-colors mr-2"
          >
            <Search size={15} />
            <span className="text-gray-400">Search tools...</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-[10px] text-gray-400 bg-white border border-gray-200 rounded font-mono">Ctrl K</kbd>
          </button>

          {/* Auth + Mobile toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">{user?.email}</span>
                </div>
                <button onClick={logout} type="button"
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg no-underline transition-colors">
                  Log in
                </Link>
                <Link to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg no-underline transition-all shadow-sm hover:shadow-md hover:shadow-indigo-200">
                  Sign up free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" title="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 max-h-[80vh] overflow-y-auto">

            {/* Mobile: Search */}
            <button
              type="button"
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="flex items-center gap-3 w-full px-3 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer mb-1"
            >
              <Search size={16} className="text-gray-400" />
              Search all tools...
            </button>

            <div className="border-t border-gray-100 my-1" />

            {/* Mobile: PDF Tools */}
            <button
              type="button"
              onClick={() => toggleMobileSection('tools')}
              className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              PDF Tools
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${mobileSection === 'tools' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'tools' && (
              <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
                {pdfToolsMenu.map((item) => (
                  <Link key={item.href} to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                    <span className={item.color}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 my-1" />

            {/* Mobile: Convert */}
            <button
              type="button"
              onClick={() => toggleMobileSection('convert')}
              className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Convert
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${mobileSection === 'convert' ? 'rotate-180' : ''}`} />
            </button>
            {mobileSection === 'convert' && (
              <div className="px-2 pb-2 space-y-3">
                <div>
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">From PDF</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {convertFromPdfMenu.map((item) => (
                      <Link key={item.href} to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                        <span className={item.color}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">To PDF</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {convertToPdfMenu.map((item) => (
                      <Link key={item.href} to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                        <span className={item.color}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Word & Image</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    {otherConversions.map((item) => (
                      <Link key={item.href} to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                        <span className={item.color}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <div className="flex gap-2 px-2 py-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg no-underline hover:bg-gray-50">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg no-underline hover:bg-indigo-700">
                    Sign up free
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
