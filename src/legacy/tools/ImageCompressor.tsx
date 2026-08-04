// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import { Upload, Download, X } from 'lucide-react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalSize(file.size);
      compress();
    }
  }, [file]);

  useEffect(() => {
    if (file) compress();
  }, [quality]);

  const compress = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setCompressedUrl(URL.createObjectURL(blob));
          setNewSize(blob.size);
        }
      }, file.type, quality / 100);
    };
    img.src = originalUrl || URL.createObjectURL(file);
  };

  const handleFile = (f: File | null) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setCompressedUrl('');
    }
  };

  const savings = originalSize > 0 && newSize > 0 ? Math.round((1 - newSize / originalSize) * 100) : 0;

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
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP</p>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm truncate flex-1">{file.name}</span>
            <button onClick={() => { setFile(null); setCompressedUrl(''); setOriginalUrl(''); }} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Quality: {quality}%</label>
            <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Original ({(originalSize / 1024).toFixed(1)} KB)</p>
              {originalUrl && <img src={originalUrl} alt="Original" className="w-full rounded-lg border border-border" />}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Compressed ({(newSize / 1024).toFixed(1)} KB) · {savings}% saved</p>
              {compressedUrl && <img src={compressedUrl} alt="Compressed" className="w-full rounded-lg border border-border" />}
            </div>
          </div>

          {compressedUrl && (
            <a href={compressedUrl} download={`compressed-${file.name}`} className="flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
              <Download className="h-4 w-4" /> Download Compressed Image
            </a>
          )}
        </div>
      )}
    </div>
  );
}
