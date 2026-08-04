// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Check, Lock, Unlock, RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

interface Swatch { hex: string; locked: boolean; }

function randomColor(): string {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export default function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<Swatch[]>(() => Array.from({ length: 5 }, () => ({ hex: randomColor(), locked: false })));
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const { showToast } = useToast();

  const generate = () => {
    setPalette((prev) => prev.map((s) => (s.locked ? s : { ...s, hex: randomColor() })));
  };

  const toggleLock = (i: number) => {
    setPalette((prev) => prev.map((s, idx) => (idx === i ? { ...s, locked: !s.locked } : s)));
  };

  const copy = async (hex: string, idx: number) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    showToast('Color copied', 'success');
    setTimeout(() => setCopiedIdx(-1), 2000);
  };

  const exportCSS = () => {
    const css = `:root {\n${palette.map((s, i) => `  --color-${i + 1}: ${s.hex};`).join('\n')}\n}`;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'palette.css'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSS exported', 'success');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={generate}><RefreshCw className="h-4 w-4" /> Generate</Button>
        <Button variant="outline" onClick={exportCSS}><Download className="h-4 w-4" /> Export CSS</Button>
      </div>

      <div className="grid grid-cols-5 gap-2 h-64 rounded-lg overflow-hidden border border-border">
        {palette.map((s, i) => (
          <div key={i} className="group relative flex flex-col items-center justify-end cursor-pointer" style={{ backgroundColor: s.hex }} onClick={() => copy(s.hex, i)}>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); toggleLock(i); }} className="p-1 rounded bg-black/20 text-white hover:bg-black/40" aria-label="Toggle lock">
                {s.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </button>
            </div>
            <div className="w-full text-center pb-3 pt-8">
              {copiedIdx === i ? <Check className="h-4 w-4 mx-auto text-white" /> : (
                <span className="text-xs font-mono text-white mix-blend-difference">{s.hex.toUpperCase()}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Click a color to copy its hex code. Lock colors to keep them when generating.</p>
    </div>
  );
}
