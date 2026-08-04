// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

const units: Record<string, number> = {
  mg: 0.001, g: 1, kg: 1000, ton: 1000000, oz: 28.3495, lb: 453.592, stone: 6350.29,
};

export default function WeightConverter() {
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState('kg');

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return {};
    const inGrams = v * units[unit];
    const res: Record<string, string> = {};
    for (const [u, factor] of Object.entries(units)) {
      res[u] = (inGrams / factor).toLocaleString('en-US', { maximumFractionDigits: 6 });
    }
    return res;
  }, [value, unit]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm" placeholder="Enter weight" />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {Object.entries(results).map(([u, v]) => (
          <div key={u} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2">
            <span className="text-sm font-medium w-16">{u}</span>
            <code className="flex-1 font-mono text-sm">{v}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
