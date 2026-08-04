// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Upload, Download, X, FileText } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [compressing, setCompressing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (f: File | null) => {
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setOriginalSize(f.size);
    }
  };

  const compress = async () => {
    if (!file) { showToast('Select a PDF first', 'error'); return; }
    setCompressing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      // Basic compression: re-save without redundant data
      const compressed = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([compressed], { type: 'application/pdf' });
      setNewSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      showToast('PDF compressed', 'success');
    } catch (e) {
      showToast('Failed to compress: ' + (e as Error).message, 'error');
    }
    setCompressing(false);
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
          <p className="text-sm text-muted-foreground">Click or drag a PDF file here</p>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <FileText className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="text-sm truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(originalSize / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={() => { setFile(null); setResultUrl(null); }} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Compression level</label>
            <select value={quality} onChange={(e) => setQuality(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="low">Low (best quality)</option>
              <option value="medium">Medium (recommended)</option>
              <option value="high">High (smallest size)</option>
            </select>
          </div>
          <Button onClick={compress} disabled={compressing} className="w-full">{compressing ? 'Compressing...' : 'Compress PDF'}</Button>
        </div>
      )}

      {resultUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm rounded-lg border border-success/30 bg-success/5 p-3">
            <span className="text-muted-foreground">Original: {(originalSize / 1024).toFixed(1)} KB</span>
            <span className="text-muted-foreground">New: {(newSize / 1024).toFixed(1)} KB</span>
            <span className="text-success font-medium">Saved: {savings}%</span>
          </div>
          <a href={resultUrl} download="compressed.pdf" className="flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
            <Download className="h-4 w-4" /> Download Compressed PDF
          </a>
        </div>
      )}
    </div>
  );
}
