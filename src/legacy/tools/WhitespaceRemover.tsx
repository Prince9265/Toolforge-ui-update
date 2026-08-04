// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function WhitespaceRemover() {
  const [input, setInput] = useState('');
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(true);

  const output = useMemo(() => {
    let result = input;
    if (trimLines) result = result.split('\n').map((l) => l.trim()).join('\n');
    if (collapseSpaces) result = result.replace(/[^\S\n]+/g, ' ');
    if (removeBlankLines) result = result.replace(/\n\s*\n/g, '\n').replace(/^\n+|\n+$/g, '');
    return result;
  }, [input, trimLines, collapseSpaces, removeBlankLines]);

  return (
    <div className="space-y-4">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Paste text with extra whitespace..." rows={6} />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Trim lines</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={collapseSpaces} onChange={(e) => setCollapseSpaces(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Collapse spaces</span></label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={removeBlankLines} onChange={(e) => setRemoveBlankLines(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Remove blank lines</span></label>
      </div>
      {output && <ToolOutput label="Cleaned Text" value={output} rows={6} fileName="cleaned.txt" />}
    </div>
  );
}
