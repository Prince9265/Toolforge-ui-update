// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useRef } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Upload, Download, X, FileText } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState('1');
  const [splitting, setSplitting] = useState(false);
  const [splitUrls, setSplitUrls] = useState<{ name: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (f: File | null) => {
    if (f && f.type === 'application/pdf') setFile(f);
  };

  const split = async () => {
    if (!file) { showToast('Select a PDF first', 'error'); return; }
    setSplitting(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pageCount = pdf.getPageCount();
      const ranges = pageRanges.split(',').map((r) => r.trim());

      const urls: { name: string; url: string }[] = [];
      for (const range of ranges) {
        const [start, end] = range.includes('-') ? range.split('-').map(Number) : [Number(range), Number(range)];
        const s = Math.max(1, start);
        const e = Math.min(pageCount, end || s);
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(pdf, Array.from({ length: e - s + 1 }, (_, i) => s - 1 + i));
        pages.forEach((p) => newPdf.addPage(p));
        const splitBytes = await newPdf.save();
        const blob = new Blob([splitBytes], { type: 'application/pdf' });
        urls.push({ name: `${file.name.replace('.pdf', '')}_pages_${s}-${e}.pdf`, url: URL.createObjectURL(blob) });
      }
      setSplitUrls(urls);
      showToast('PDF split successfully', 'success');
    } catch (e) {
      showToast('Failed to split PDF: ' + (e as Error).message, 'error');
    }
    setSplitting(false);
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
          <p className="text-sm text-muted-foreground">Click or drag a PDF file here</p>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => handleFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <FileText className="h-5 w-5 text-red-500" />
            <span className="flex-1 text-sm truncate">{file.name}</span>
            <button onClick={() => { setFile(null); setSplitUrls([]); }} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove"><X className="h-4 w-4" /></button>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Page ranges (e.g. 1-3, 5, 7-10)</label>
            <input type="text" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-mono" placeholder="1-3, 5, 7-10" />
          </div>
          <Button onClick={split} disabled={splitting} className="w-full">{splitting ? 'Splitting...' : 'Split PDF'}</Button>
        </div>
      )}

      {splitUrls.length > 0 && (
        <div className="space-y-2">
          {splitUrls.map((u, i) => (
            <a key={i} href={u.url} download={u.name} className="flex items-center justify-center gap-2 h-10 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors">
              <Download className="h-4 w-4" /> {u.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
