import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../../store/useEditorStore';

interface CanvasOverlayProps {
  width: number;
  height: number;
}

const PDF_TO_PX = 800 / 595.28;

export default function CanvasOverlay({ width, height }: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isInitialized = useRef(false);
  const { activeTool, removeOperation } = useEditorStore();

  // Initialize canvas once
  useEffect(() => {
    if (!canvasRef.current || isInitialized.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true,
      containerClass: 'canvas-container',
    });

    fabricRef.current = canvas;
    isInitialized.current = true;

    // Expose canvas globally for parent access
    (window as unknown as Record<string, unknown>).__pdfcraft_canvas = {
      getCanvas: () => fabricRef.current,
      addImage: (url: string, id: string) => _addImageToCanvas(canvas, url, id),
      addSignature: (dataUrl: string) => _addSignatureToCanvas(canvas, dataUrl),
    };

    return () => {
      delete (window as unknown as Record<string, unknown>).__pdfcraft_canvas;
      canvas.dispose();
      fabricRef.current = null;
      isInitialized.current = false;
    };
  }, []);

  // Resize canvas when dimensions change
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.setDimensions({ width, height });
    canvas.renderAll();
  }, [width, height]);

  // Handle tool mode switching
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';

    switch (activeTool) {
      case 'draw':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';
        break;
      case 'highlight':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 20;
        canvas.freeDrawingBrush.color = 'rgba(255, 255, 0, 0.4)';
        break;
      case 'select':
        canvas.selection = true;
        break;
      default:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.selection = false;
        break;
    }

    canvas.renderAll();
  }, [activeTool]);

  // Handle mouse:down for creating objects
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleMouseDown = (opt: fabric.TPointerEventInfo) => {
      if (activeTool === 'select' || activeTool === 'draw' || activeTool === 'highlight') return;
      if (canvas.getActiveObject()) return; // Don't create if clicking existing object

      const pointer = canvas.getScenePoint(opt.e);
      const x = pointer.x;
      const y = pointer.y;
      const page = useEditorStore.getState().currentPage;
      const opCount = useEditorStore.getState().operations.length;

      switch (activeTool) {
        case 'text': {
          const text = new fabric.IText('Type here', {
            left: x, top: y,
            fontSize: 16,
            fontFamily: 'Helvetica',
            fill: '#000000',
            editable: true,
          });
          canvas.add(text);
          canvas.setActiveObject(text);
          text.enterEditing();
          text.selectAll();

          useEditorStore.getState().addOperation({
            page_number: page, operation_type: 'text',
            x: x / PDF_TO_PX, y: y / PDF_TO_PX,
            width: 200 / PDF_TO_PX, height: 30 / PDF_TO_PX,
            rotation: 0, z_index: opCount,
            properties: {
              content: 'Type here', font_size: 16,
              font_family: 'Helvetica', font_color: '#000000',
              bold: false, italic: false,
            },
          });
          // Switch to select after placing text
          useEditorStore.getState().setActiveTool('select');
          break;
        }
        case 'shape': {
          const rect = new fabric.Rect({
            left: x, top: y, width: 150, height: 100,
            fill: 'rgba(99, 102, 241, 0.1)',
            stroke: '#6366f1', strokeWidth: 2,
            rx: 4, ry: 4,
          });
          canvas.add(rect);
          canvas.setActiveObject(rect);
          useEditorStore.getState().addOperation({
            page_number: page, operation_type: 'shape',
            x: x / PDF_TO_PX, y: y / PDF_TO_PX,
            width: 150 / PDF_TO_PX, height: 100 / PDF_TO_PX,
            rotation: 0, z_index: opCount,
            properties: {
              shape_type: 'rectangle', fill_color: 'rgba(99, 102, 241, 0.1)',
              stroke_color: '#6366f1', stroke_width: 2,
            },
          });
          useEditorStore.getState().setActiveTool('select');
          break;
        }
        case 'comment': {
          const marker = new fabric.Circle({
            left: x, top: y, radius: 14,
            fill: '#f97316', stroke: '#ea580c', strokeWidth: 2,
          });
          canvas.add(marker);
          canvas.setActiveObject(marker);
          useEditorStore.getState().addOperation({
            page_number: page, operation_type: 'annotation',
            x: x / PDF_TO_PX, y: y / PDF_TO_PX,
            width: 28 / PDF_TO_PX, height: 28 / PDF_TO_PX,
            rotation: 0, z_index: opCount,
            properties: { annotation_type: 'comment', content: '', color: '#f97316' },
          });
          useEditorStore.getState().setActiveTool('select');
          break;
        }
      }
      canvas.renderAll();
    };

    canvas.on('mouse:down', handleMouseDown);
    return () => { canvas.off('mouse:down', handleMouseDown); };
  }, [activeTool]);

  // Handle freehand path created
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handlePathCreated = (e: unknown) => {
      const evt = e as { path: fabric.Path };
      const path = evt.path;
      if (!path) return;
      const page = useEditorStore.getState().currentPage;
      const isHL = useEditorStore.getState().activeTool === 'highlight';

      useEditorStore.getState().addOperation({
        page_number: page, operation_type: 'freehand',
        x: (path.left ?? 0) / PDF_TO_PX, y: (path.top ?? 0) / PDF_TO_PX,
        width: (path.width ?? 0) / PDF_TO_PX, height: (path.height ?? 0) / PDF_TO_PX,
        rotation: 0, z_index: useEditorStore.getState().operations.length,
        properties: {
          path_data: path.path,
          stroke_color: isHL ? 'rgba(255,255,0,0.4)' : '#000000',
          stroke_width: isHL ? 20 : 2, is_highlight: isHL,
        },
      });
    };

    canvas.on('path:created', handlePathCreated as never);
    return () => { canvas.off('path:created', handlePathCreated as never); };
  }, []);

  // Delete key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Don't delete if editing text
      const active = canvas.getActiveObject();
      if (active instanceof fabric.IText && active.isEditing) return;

      if (e.key === 'Delete' || (e.key === 'Backspace' && !(e.target instanceof HTMLElement && e.target.isContentEditable))) {
        const objects = canvas.getActiveObjects();
        if (objects.length > 0) {
          objects.forEach((obj) => {
            const data = (obj as fabric.FabricObject & { data?: { operationId?: string } }).data;
            if (data?.operationId) removeOperation(data.operationId);
            canvas.remove(obj);
          });
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [removeOperation]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10"
    />
  );
}

// Helper functions for image/signature (called via window.__pdfcraft_canvas)
function _addImageToCanvas(canvas: fabric.Canvas, imageUrl: string, _imageId: string) {
  fabric.FabricImage.fromURL(imageUrl).then((img) => {
    const maxW = 300;
    const s = img.width && img.width > maxW ? maxW / img.width : 1;
    img.set({ left: 100, top: 100, scaleX: s, scaleY: s });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();

    const page = useEditorStore.getState().currentPage;
    useEditorStore.getState().addOperation({
      page_number: page, operation_type: 'image',
      x: 100 / PDF_TO_PX, y: 100 / PDF_TO_PX,
      width: ((img.width ?? 200) * s) / PDF_TO_PX,
      height: ((img.height ?? 200) * s) / PDF_TO_PX,
      rotation: 0, z_index: useEditorStore.getState().operations.length,
      properties: { image_id: _imageId },
    });
  });
}

function _addSignatureToCanvas(canvas: fabric.Canvas, dataUrl: string) {
  fabric.FabricImage.fromURL(dataUrl).then((img) => {
    const maxW = 200;
    const s = img.width && img.width > maxW ? maxW / img.width : 1;
    img.set({ left: 200, top: 400, scaleX: s, scaleY: s });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();

    const page = useEditorStore.getState().currentPage;
    useEditorStore.getState().addOperation({
      page_number: page, operation_type: 'signature',
      x: 200 / PDF_TO_PX, y: 400 / PDF_TO_PX,
      width: ((img.width ?? 200) * s) / PDF_TO_PX,
      height: ((img.height ?? 100) * s) / PDF_TO_PX,
      rotation: 0, z_index: useEditorStore.getState().operations.length,
      properties: { signature_data: dataUrl },
    });
  });
}
