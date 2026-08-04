// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { ToolInput } from '@/legacy/ToolUI';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<'of' | 'isWhat' | 'change'>('of');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const a = parseFloat(val1);
    const b = parseFloat(val2);
    if (isNaN(a) || isNaN(b)) { setResult(null); return; }
    if (mode === 'of') setResult(`${b}% of ${a} = ${(b / 100 * a).toFixed(2)}`);
    else if (mode === 'isWhat') setResult(`${b} is ${((b / a) * 100).toFixed(2)}% of ${a}`);
    else setResult(`Change from ${a} to ${b}: ${(((b - a) / a) * 100).toFixed(2)}%`);
  };

  const labels: Record<typeof mode, [string, string]> = {
    of: ['Number', 'Percentage (%)'],
    isWhat: ['Total', 'Part'],
    change: ['Original', 'New Value'],
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {([['of', 'X% of Y'], ['isWhat', 'X is what % of Y'], ['change', '% Change']] as const).map(([m, l]) => (
          <button key={m} onClick={() => { setMode(m); setResult(null); }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ToolInput label={labels[mode][0]} value={val1} onChange={(v) => { setVal1(v); setResult(null); }} placeholder="0" rows={1} />
        <ToolInput label={labels[mode][1]} value={val2} onChange={(v) => { setVal2(v); setResult(null); }} placeholder="0" rows={1} />
      </div>
      <button onClick={calculate} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-700 transition-colors">Calculate</button>
      {result && <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-lg font-semibold text-success animate-fade-in">{result}</div>}
    </div>
  );
}
