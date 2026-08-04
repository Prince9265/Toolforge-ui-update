// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removedCount, setRemovedCount] = useState(0);

  const process = () => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    let removed = 0;
    for (const line of lines) {
      const key = trimWhitespace ? line.trim() : line;
      const compareKey = caseSensitive ? key : key.toLowerCase();
      if (seen.has(compareKey)) { removed++; continue; }
      seen.add(compareKey);
      result.push(key);
    }
    setOutput(result.join('\n'));
    setRemovedCount(removed);
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Paste text with duplicate lines..." rows={8} />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Case sensitive</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={trimWhitespace} onChange={(e) => setTrimWhitespace(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Trim whitespace</span></label>
        <Button onClick={process}>Remove Duplicates</Button>
      </div>
      {output && (
        <>
          <p className="text-sm text-success">{removedCount} duplicate line{removedCount !== 1 ? 's' : ''} removed</p>
          <ToolOutput label="Result" value={output} rows={8} fileName="unique-lines.txt" />
        </>
      )}
    </div>
  );
}
