// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Upload, Download, X } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('image/png');
  const [convertedUrl, setConvertedUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (file) convert();
  }, [file, format]);

  const convert = () => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (format === 'image/jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setConvertedUrl(URL.createObjectURL(blob));
          showToast('Image converted', 'success');
        }
      }, format, 0.9);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleFile = (f: File | null) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setConvertedUrl('');
    }
  };

  const formats = [
    { label: 'PNG', value: 'image/png' },
    { label: 'JPEG', value: 'image/jpeg' },
    { label: 'WebP', value: 'image/webp' },
  ];

  const ext = format.split('/')[1];

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
            <button onClick={() => { setFile(null); setConvertedUrl(''); }} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Convert to</label>
            <div className="flex gap-2">
              {formats.map((f) => (
                <Button key={f.value} variant={format === f.value ? 'primary' : 'outline'} size="sm" onClick={() => setFormat(f.value)}>
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
          {convertedUrl && (
            <>
              <img src={convertedUrl} alt="Converted" className="w-full rounded-lg border border-border" />
              <a href={convertedUrl} download={`converted.${ext}`} className="flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
                <Download className="h-4 w-4" /> Download {ext.toUpperCase()}
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
