// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Download } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    generateQR();
  }, [text, size, fgColor, bgColor]);

  const generateQR = async () => {
    if (!text) return;
    try {
      const { default: QRCode } = await import('qrcode');
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: size,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
        });
      }
    } catch {
      showToast('Failed to generate QR code', 'error');
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = 'qr-code.png'; a.click();
    showToast('QR code downloaded', 'success');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Text or URL</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="Enter text or URL" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Size</label>
          <input type="number" min="64" max="512" value={size} onChange={(e) => setSize(Number(e.target.value))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Foreground</label>
          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-full rounded-lg border border-input cursor-pointer" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full rounded-lg border border-input cursor-pointer" />
        </div>
      </div>

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="rounded-lg border border-border" />
      </div>

      <Button onClick={download} className="w-full"><Download className="h-4 w-4" /> Download QR Code</Button>
    </div>
  );
}
