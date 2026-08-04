// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

const units: Record<string, number> = { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knot': 0.514444, 'ft/s': 0.3048 };

export default function SpeedConverter() {
  const [value, setValue] = useState('100');
  const [unit, setUnit] = useState('km/h');

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return {};
    const inMs = v * units[unit];
    const res: Record<string, string> = {};
    for (const [u, factor] of Object.entries(units)) {
      res[u] = (inMs / factor).toLocaleString('en-US', { maximumFractionDigits: 4 });
    }
    return res;
  }, [value, unit]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm" placeholder="Enter speed" />
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
