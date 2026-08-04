// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function YamlToJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    if (!input.trim()) { setError('Please enter YAML'); setOutput(''); return; }
    try {
      const lines = input.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
      const result: Record<string, unknown> = {};
      const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: 0 }];

      for (const line of lines) {
        const indent = line.length - line.trimStart().length;
        const trimmed = line.trim();

        if (trimmed.includes(':')) {
          const colonIdx = trimmed.indexOf(':');
          const key = trimmed.slice(0, colonIdx).trim();
          const value = trimmed.slice(colonIdx + 1).trim();

          while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
          const parent = stack[stack.length - 1].obj;

          if (!value) {
            const newObj: Record<string, unknown> = {};
            parent[key] = newObj;
            stack.push({ obj: newObj, indent });
          } else {
            let parsed: unknown = value;
            if (value === 'true') parsed = true;
            else if (value === 'false') parsed = false;
            else if (value === 'null' || value === '~') parsed = null;
            else if (!isNaN(Number(value)) && value.trim() !== '') parsed = Number(value);
            else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) parsed = value.slice(1, -1);
            else if (value.startsWith('[') && value.endsWith(']')) {
              parsed = value.slice(1, -1).split(',').map((v) => v.trim()).filter(Boolean);
            }
            parent[key] = parsed;
          }
        }
      }

      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="YAML Input" value={input} onChange={setInput} placeholder="key: value&#10;nested:" rows={6} />
      <Button onClick={convert}>Convert to JSON</Button>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="JSON Output" value={output} rows={8} fileName="output.json" mime="application/json" />}
    </div>
  );
}
