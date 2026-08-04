// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function TextRepeater() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(3);
  const [separator, setSeparator] = useState<'newline' | 'space' | 'comma' | 'none'>('newline');
  const [output, setOutput] = useState('');

  const generate = () => {
    const sep = separator === 'newline' ? '\n' : separator === 'space' ? ' ' : separator === 'comma' ? ', ' : '';
    setOutput(Array.from({ length: count }, () => text).join(sep));
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Text to Repeat" value={text} onChange={setText} placeholder="Enter text..." rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Count: {count}</label>
          <input type="range" min="1" max="10000" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Separator</label>
          <select value={separator} onChange={(e) => setSeparator(e.target.value as typeof separator)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
            <option value="newline">New line</option>
            <option value="space">Space</option>
            <option value="comma">Comma</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <Button onClick={generate}>Generate</Button>
      {output && <ToolOutput label="Result" value={output} rows={6} fileName="repeated.txt" />}
    </div>
  );
}
