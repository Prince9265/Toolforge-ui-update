// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function UrlEncode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));

  return (
    <div className="space-y-4">
      <ToolInput label="Text to Encode" value={input} onChange={setInput} placeholder="Enter text to URL encode..." rows={6} />
      <Button onClick={encode}>URL Encode</Button>
      {output && <ToolOutput label="Encoded URL" value={output} rows={6} fileName="encoded.txt" />}
    </div>
  );
}
