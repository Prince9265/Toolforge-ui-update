// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function CsvToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    if (!input.trim()) { setError('Please enter CSV data'); setOutput(''); return; }
    try {
      const lines = input.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim());
      const result = lines.slice(1).map((line) => {
        const values = line.split(',');
        return Object.fromEntries(headers.map((h, i) => [h, (values[i] || '').trim()]));
      });
      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="CSV Input" value={input} onChange={setInput} placeholder="name,age&#10;John,30" rows={6} />
      <Button onClick={convert}>Convert to JSON</Button>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="JSON Output" value={output} rows={10} fileName="output.json" mime="application/json" />}
    </div>
  );
}
