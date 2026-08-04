// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

const units: Record<string, number> = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, yd: 0.9144, mile: 1609.344,
};

export default function LengthConverter() {
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState('m');
  const [copied, setCopied] = useState('');
  const { showToast } = useToast();

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return {};
    const inMeters = v * units[unit];
    const res: Record<string, string> = {};
    for (const [u, factor] of Object.entries(units)) {
      res[u] = (inMeters / factor).toLocaleString('en-US', { maximumFractionDigits: 6 });
    }
    return res;
  }, [value, unit]);

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    showToast('Copied', 'success');
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm" placeholder="Enter value" />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {Object.entries(results).map(([u, v]) => (
          <div key={u} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2">
            <span className="text-sm font-medium w-16">{u}</span>
            <code className="flex-1 font-mono text-sm">{v}</code>
            <button onClick={() => copy(u, v)} className="text-muted-foreground hover:text-foreground" aria-label="Copy">{copied === u ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
