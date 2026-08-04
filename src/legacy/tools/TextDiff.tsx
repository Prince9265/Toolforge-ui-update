// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput } from '@/legacy/ToolUI';

export default function TextDiff() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const diff = useMemo(() => {
    if (!left && !right) return [];
    const leftLines = left.split('\n');
    const rightLines = right.split('\n');
    const maxLen = Math.max(leftLines.length, rightLines.length);
    const result: { type: 'same' | 'add' | 'del'; left: string; right: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i] ?? '';
      const r = rightLines[i] ?? '';
      if (l === r) result.push({ type: 'same', left: l, right: r });
      else {
        if (l) result.push({ type: 'del', left: l, right: '' });
        if (r) result.push({ type: 'add', left: '', right: r });
      }
    }
    return result;
  }, [left, right]);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <ToolInput label="Original Text" value={left} onChange={setLeft} placeholder="Paste original text..." rows={8} />
        <ToolInput label="Modified Text" value={right} onChange={setRight} placeholder="Paste modified text..." rows={8} />
      </div>
      <Button onClick={() => { setLeft(''); setRight(''); }}>Clear</Button>
      {diff.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 text-sm font-medium">Differences</div>
          <div className="font-mono text-sm">
            {diff.map((line, i) => (
              <div key={i} className={`px-4 py-1 ${line.type === 'add' ? 'bg-success/10 text-success' : line.type === 'del' ? 'bg-destructive/10 text-destructive' : ''}`}>
                <span className="mr-2 select-none">
                  {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                </span>
                {line.type === 'del' ? line.left : line.right}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
