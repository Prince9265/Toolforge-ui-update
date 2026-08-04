// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function Base64Encode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setOutput('Error: Unable to encode input');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Text to Encode" value={input} onChange={setInput} placeholder="Enter text to encode..." rows={6} />
      <Button onClick={encode}>Encode to Base64</Button>
      {output && <ToolOutput label="Base64 Output" value={output} rows={6} fileName="encoded.txt" />}
    </div>
  );
}
