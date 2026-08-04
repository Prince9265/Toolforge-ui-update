// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef } from 'react';
import { Upload, X, Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [mime, setMime] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setMime(file.type);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(base64);
    setCopied(true);
    showToast('Base64 copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {!base64 ? (
        <div onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0] || null); }} className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/40 transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click or drag an image here</p>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm truncate flex-1">{fileName}</span>
            <button onClick={() => { setBase64(''); setFileName(''); }} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
          </div>
          <img src={base64} alt="Preview" className="max-h-48 rounded-lg border border-border mx-auto" />
          <div>
            <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium">Base64 Data URI</label><button onClick={copy} className="text-muted-foreground hover:text-foreground" aria-label="Copy">{copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}</button></div>
            <textarea readOnly value={base64} className="w-full rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs h-32 resize-y" />
            <p className="text-xs text-muted-foreground mt-1">{mime} · {base64.length} characters</p>
          </div>
        </div>
      )}
    </div>
  );
}
