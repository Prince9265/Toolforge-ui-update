// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function UrlDecode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
      setError('');
    } catch {
      setError('Invalid URL-encoded input');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="URL to Decode" value={input} onChange={setInput} placeholder="Enter URL-encoded text..." rows={6} />
      <Button onClick={decode}>URL Decode</Button>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="Decoded Text" value={output} rows={6} fileName="decoded.txt" />}
    </div>
  );
}
