// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const { showToast } = useToast();

  const generate = () => {
    const results: string[] = [];
    for (let n = 0; n < count; n++) {
      if (typeof crypto.randomUUID === 'function') {
        results.push(crypto.randomUUID());
      } else {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
        results.push(`${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`);
      }
    }
    setUuids(results);
  };

  const copyOne = async (uuid: string, idx: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIdx(idx);
    showToast('UUID copied', 'success');
    setTimeout(() => setCopiedIdx(-1), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    showToast('All UUIDs copied', 'success');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Count:</label>
        <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="h-9 w-20 rounded-lg border border-input bg-background px-3 text-sm" />
        <Button onClick={generate}>Generate</Button>
        {uuids.length > 0 && <Button variant="outline" onClick={copyAll}>Copy All</Button>}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2">
              <code className="flex-1 font-mono text-sm">{uuid}</code>
              <button onClick={() => copyOne(uuid, i)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy UUID">
                {copiedIdx === i ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
