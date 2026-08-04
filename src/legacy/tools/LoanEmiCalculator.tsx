// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

export default function LoanEmiCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(12);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = months;
    if (r === 0) return { emi: amount / n, totalInterest: 0, totalPayment: amount };
    const e = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = e * n;
    return { emi: e, totalInterest: total - amount, totalPayment: total };
  }, [amount, rate, months]);

  const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Loan Amount: ${fmt(amount)}</label>
          <input type="range" min="1000" max="10000000" step="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Interest Rate: {rate}% per year</label>
          <input type="range" min="0.1" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Tenure: {months} months</label>
          <input type="range" min="1" max="360" step="1" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
          <p className="text-xl font-bold text-primary">${fmt(emi)}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
          <p className="text-xl font-bold">${fmt(totalInterest)}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
          <p className="text-xl font-bold">${fmt(totalPayment)}</p>
        </div>
      </div>
    </div>
  );
}
