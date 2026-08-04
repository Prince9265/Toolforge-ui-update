// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState('-');

  const generate = () => {
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, separator)
      .replace(new RegExp(`${separator}+`, 'g'), separator)
      .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
    setOutput(slug);
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Title or Text" value={input} onChange={setInput} placeholder="Enter a title to generate a slug..." rows={3} />
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Separator:</label>
        <select value={separator} onChange={(e) => setSeparator(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-2 text-sm">
          <option value="-">Dash (-)</option>
          <option value="_">Underscore (_)</option>
        </select>
      </div>
      <Button onClick={generate}>Generate Slug</Button>
      {output && <ToolOutput label="URL Slug" value={output} rows={2} />}
    </div>
  );
}
