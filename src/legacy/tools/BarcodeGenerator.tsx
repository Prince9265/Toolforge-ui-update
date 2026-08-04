// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Download } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function BarcodeGenerator() {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    generateBarcode();
  }, [text, format]);

  const generateBarcode = async () => {
    if (!text) return;
    try {
      const JsBarcode = (await import('jsbarcode')).default;
      if (canvasRef.current) {
        JsBarcode(canvasRef.current, text, {
          format,
          width: 2,
          height: 100,
          displayValue: true,
        });
      }
    } catch {
      showToast('Failed to generate barcode', 'error');
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = 'barcode.png'; a.click();
    showToast('Barcode downloaded', 'success');
  };

  const formats = ['CODE128', 'EAN13', 'EAN8', 'UPC', 'CODE39', 'ITF14', 'MSI', 'pharmacode', 'codabar'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Data</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="Enter data" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
            {formats.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-center bg-white rounded-lg border border-border p-4">
        <canvas ref={canvasRef} />
      </div>

      <Button onClick={download} className="w-full"><Download className="h-4 w-4" /> Download Barcode</Button>
    </div>
  );
}
