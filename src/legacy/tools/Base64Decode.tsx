// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function Base64Decode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
      setError('');
    } catch {
      setError('Invalid Base64 input');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Base64 to Decode" value={input} onChange={setInput} placeholder="Enter Base64 string..." rows={6} />
      <Button onClick={decode}>Decode</Button>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="Decoded Text" value={output} rows={6} fileName="decoded.txt" />}
    </div>
  );
}
