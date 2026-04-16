import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MergeTool from './components/tools/MergeTool';
import SplitTool from './components/tools/SplitTool';
import RotateTool from './components/tools/RotateTool';
import ReorderTool from './components/tools/ReorderTool';
import ExtractTool from './components/tools/ExtractTool';
import CompressTool from './components/tools/CompressTool';
import WatermarkTool from './components/tools/WatermarkTool';
import ConversionTool from './components/conversions/ConversionTool';
import OCRTool from './components/conversions/OCRTool';
import PdfToPptPage from './pages/PdfToPptPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:docId" element={<EditorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Page Tools */}
          <Route path="/tools/merge" element={<MergeTool />} />
          <Route path="/tools/split" element={<SplitTool />} />
          <Route path="/tools/rotate" element={<RotateTool />} />
          <Route path="/tools/reorder" element={<ReorderTool />} />
          <Route path="/tools/extract" element={<ExtractTool />} />
          <Route path="/tools/compress" element={<CompressTool />} />
          <Route path="/tools/watermark" element={<WatermarkTool />} />

          {/* Conversions */}
          <Route path="/convert/ocr" element={<OCRTool />} />
          <Route path="/convert/pdf-to-ppt" element={<PdfToPptPage />} />
          <Route path="/convert/:convType" element={<ConversionTool />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
