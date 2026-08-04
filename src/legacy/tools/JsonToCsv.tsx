// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function JsonToCsv() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    if (!input.trim()) { setError('Please enter JSON data'); setOutput(''); return; }
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setOutput(''); return; }

      const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
        const result: Record<string, string> = {};
        for (const [key, val] of Object.entries(obj)) {
          const newKey = prefix ? `${prefix}.${key}` : key;
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            Object.assign(result, flatten(val as Record<string, unknown>, newKey));
          } else if (Array.isArray(val)) {
            result[newKey] = val.join(';');
          } else {
            result[newKey] = String(val ?? '');
          }
        }
        return result;
      };

      const flatArr = arr.map((item) => flatten(item as Record<string, unknown>));
      const headers = [...new Set(flatArr.flatMap((o) => Object.keys(o)))];
      const csvLines = [headers.join(',')];
      for (const row of flatArr) {
        csvLines.push(headers.map((h) => `"${(row[h] || '').replace(/"/g, '""')}"`).join(','));
      }
      setOutput(csvLines.join('\n'));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="JSON Input" value={input} onChange={setInput} placeholder='[{"name":"John","age":30}]' rows={6} />
      <Button onClick={convert}>Convert to CSV</Button>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="CSV Output" value={output} rows={10} fileName="output.csv" mime="text/csv" />}
    </div>
  );
}
