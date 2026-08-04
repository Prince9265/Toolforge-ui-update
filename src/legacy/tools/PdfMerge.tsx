// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Upload, X, FileText, Download } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfs = Array.from(newFiles).filter((f) => f.type === 'application/pdf');
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const moveFile = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const merge = async () => {
    if (files.length < 2) { showToast('Select at least 2 PDFs to merge', 'error'); return; }
    setMerging(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setMergedUrl(URL.createObjectURL(blob));
      showToast('PDFs merged successfully', 'success');
    } catch (e) {
      showToast('Failed to merge PDFs: ' + (e as Error).message, 'error');
    }
    setMerging(false);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/40 transition-colors"
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Click or drag PDF files here</p>
        <input ref={inputRef} type="file" accept="application/pdf" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <FileText className="h-5 w-5 text-red-500 shrink-0" />
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="px-2 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">↑</button>
                <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="px-2 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">↓</button>
                <button onClick={() => removeFile(i)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <Button onClick={merge} disabled={merging} className="w-full">
          {merging ? 'Merging...' : `Merge ${files.length} PDFs`}
        </Button>
      )}

      {mergedUrl && (
        <div className="space-y-2">
          <a href={mergedUrl} download="merged.pdf" className="flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
            <Download className="h-4 w-4" /> Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
}
