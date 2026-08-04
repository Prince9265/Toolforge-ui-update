// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / 86400000);
    return { years, months, days, totalDays, daysToBirthday };
  }, [birthDate]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Your Birth Date</label>
        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
      </div>
      {result && (
        <div className="space-y-3 animate-fade-in">
          <div className="rounded-lg border border-border bg-primary/5 p-6 text-center">
            <p className="text-3xl font-bold text-primary">{result.years} years, {result.months} months, {result.days} days</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Total Days Lived</p><p className="text-xl font-bold">{result.totalDays.toLocaleString()}</p></div>
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Days to Next Birthday</p><p className="text-xl font-bold">{result.daysToBirthday}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}
