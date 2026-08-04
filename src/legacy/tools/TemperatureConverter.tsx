// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

const toC = (val: number, unit: string) => {
  if (unit === 'C') return val;
  if (unit === 'F') return (val - 32) * 5 / 9;
  return val - 273.15;
};
const fromC = (c: number, unit: string) => {
  if (unit === 'C') return c;
  if (unit === 'F') return c * 9 / 5 + 32;
  return c + 273.15;
};

export default function TemperatureConverter() {
  const [value, setValue] = useState('0');
  const [unit, setUnit] = useState('C');

  const results = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return {};
    const c = toC(v, unit);
    return { C: fromC(c, 'C').toFixed(2), F: fromC(c, 'F').toFixed(2), K: fromC(c, 'K').toFixed(2) };
  }, [value, unit]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm" placeholder="Enter temperature" />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(results).map(([u, v]) => (
          <div key={u} className="rounded-lg border border-border bg-muted/30 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{u === 'C' ? 'Celsius' : u === 'F' ? 'Fahrenheit' : 'Kelvin'}</p>
            <p className="text-lg font-bold">{v}°{u === 'K' ? '' : u}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
