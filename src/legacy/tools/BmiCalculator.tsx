// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) return null;
    if (unit === 'metric') return w / Math.pow(h / 100, 2);
    return (703 * w) / Math.pow(h, 2);
  }, [height, weight, unit]);

  const category = bmi ? (bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese') : '';
  const catColor = bmi ? (bmi < 18.5 ? 'text-warning' : bmi < 25 ? 'text-success' : bmi < 30 ? 'text-warning' : 'text-destructive') : '';

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['metric', 'imperial'] as const).map((u) => (
          <button key={u} onClick={() => { setUnit(u); setHeight(''); setWeight(''); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${unit === u ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{u === 'metric' ? 'Metric (cm/kg)' : 'Imperial (in/lb)'}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
      </div>
      {bmi && (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-center animate-fade-in">
          <p className="text-4xl font-bold text-primary mb-2">{bmi.toFixed(1)}</p>
          <p className={`text-lg font-medium ${catColor}`}>{category}</p>
        </div>
      )}
    </div>
  );
}
