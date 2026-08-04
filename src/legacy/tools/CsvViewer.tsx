// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput } from '@/legacy/ToolUI';

export default function CsvViewer() {
  const [input, setInput] = useState('');
  const [sortCol, setSortCol] = useState(-1);
  const [sortAsc, setSortAsc] = useState(true);

  const data = useMemo(() => {
    if (!input.trim()) return [];
    const lines = input.trim().split('\n');
    return lines.map((line) => line.split(','));
  }, [input]);

  const sorted = useMemo(() => {
    if (sortCol < 0 || data.length < 2) return data;
    const [header, ...rows] = data;
    const sortedRows = [...rows].sort((a, b) => {
      const av = a[sortCol] || '';
      const bv = b[sortCol] || '';
      const an = parseFloat(av);
      const bn = parseFloat(bv);
      if (!isNaN(an) && !isNaN(bn)) return sortAsc ? an - bn : bn - an;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return [header, ...sortedRows];
  }, [data, sortCol, sortAsc]);

  const handleSort = (col: number) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  return (
    <div className="space-y-4">
      <ToolInput
        label="CSV Data"
        value={input}
        onChange={setInput}
        placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,Boston"
        rows={6}
      />

      {sorted.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {sorted[0].map((cell, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(i)}
                    className="px-3 py-2 text-left font-medium cursor-pointer hover:bg-muted transition-colors whitespace-nowrap"
                  >
                    {cell} {sortCol === i && (sortAsc ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.slice(1).map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 whitespace-nowrap">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {data.length - 1} rows · {data[0]?.length || 0} columns
        </p>
      )}
    </div>
  );
}
