// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);

  const { tip, total, perPerson } = useMemo(() => {
    const b = parseFloat(bill) || 0;
    const t = (b * tipPercent) / 100;
    return { tip: t, total: b + t, perPerson: (b + t) / Math.max(1, people) };
  }, [bill, tipPercent, people]);

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Bill Amount</label>
        <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Tip: {tipPercent}%</label>
        <div className="flex gap-2 mb-2">
          {[10, 15, 18, 20, 25].map((p) => (
            <button key={p} onClick={() => setTipPercent(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tipPercent === p ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{p}%</button>
          ))}
        </div>
        <input type="range" min="0" max="50" value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Split between: {people} {people === 1 ? 'person' : 'people'}</label>
        <input type="range" min="1" max="20" value={people} onChange={(e) => setPeople(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Tip</p><p className="text-lg font-bold">${fmt(tip)}</p></div>
        <div className="rounded-lg border border-border bg-primary/5 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-lg font-bold text-primary">${fmt(total)}</p></div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Per Person</p><p className="text-lg font-bold">${fmt(perPerson)}</p></div>
      </div>
    </div>
  );
}
