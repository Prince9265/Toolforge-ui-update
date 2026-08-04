// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Upload, Download, X, Loader2 } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (f: File | null) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setResultUrl('');
    }
  };

  const removeBackground = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple edge-based background removal
        // Sample corner pixels as background color
        const corners = [
          [0, 0], [canvas.width - 1, 0], [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
        ];
        let avgR = 0, avgG = 0, avgB = 0;
        for (const [x, y] of corners) {
          const idx = (y * canvas.width + x) * 4;
          avgR += data[idx]; avgG += data[idx + 1]; avgB += data[idx + 2];
        }
        avgR /= 4; avgG /= 4; avgB /= 4;

        const threshold = 40;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const dist = Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2);
          if (dist < threshold) {
            data[i + 3] = 0; // Make transparent
          } else if (dist < threshold + 30) {
            // Feather edges
            data[i + 3] = Math.floor(((dist - threshold) / 30) * 255);
          }
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            setResultUrl(URL.createObjectURL(blob));
            showToast('Background removed', 'success');
          }
        }, 'image/png');
        setProcessing(false);
      };
      img.onerror = () => {
        showToast('Failed to process image', 'error');
        setProcessing(false);
      };
      img.src = URL.createObjectURL(file);
    } catch (e) {
      showToast('Failed: ' + (e as Error).message, 'error');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/40 transition-colors"
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click or drag an image here</p>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm truncate flex-1">{file.name}</span>
            <button onClick={() => { setFile(null); setResultUrl(''); }} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
          </div>
          <Button onClick={removeBackground} disabled={processing} className="w-full">
            {processing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : 'Remove Background'}
          </Button>
          {resultUrl && (
            <>
              <div className="rounded-lg border border-border overflow-hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23e5e7eb\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23e5e7eb\'/%3E%3C/svg%3E")' }}>
                <img src={resultUrl} alt="Result" className="w-full" />
              </div>
              <a href={resultUrl} download="transparent.png" className="flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
                <Download className="h-4 w-4" /> Download PNG
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
