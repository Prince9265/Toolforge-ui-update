// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function TextReverser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');

  const reverse = () => {
    let result = '';
    if (mode === 'chars') result = [...input].reverse().join('');
    else if (mode === 'words') result = input.split(/\s+/).reverse().join(' ');
    else result = input.split('\n').reverse().join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to reverse..." rows={5} />
      <div className="flex flex-wrap items-center gap-3">
        <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="chars">Reverse Characters</option>
          <option value="words">Reverse Words</option>
          <option value="lines">Reverse Lines</option>
        </select>
        <Button onClick={reverse}>Reverse</Button>
      </div>
      {output && <ToolOutput label="Reversed Text" value={output} rows={5} />}
    </div>
  );
}
