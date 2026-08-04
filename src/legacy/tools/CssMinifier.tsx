// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function CssMinifier() {
  const [input, setInput] = useState('');

  const { output, originalSize, minifiedSize } = useMemo(() => {
    if (!input.trim()) return { output: '', originalSize: 0, minifiedSize: 0 };
    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    return { output: minified, originalSize: input.length, minifiedSize: minified.length };
  }, [input]);

  const savings = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

  return (
    <div className="space-y-4">
      <ToolInput label="Input CSS" value={input} onChange={setInput} placeholder="body { margin: 0; }" rows={8} />
      {output && (
        <>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Original: {originalSize} bytes</span>
            <span className="text-muted-foreground">Minified: {minifiedSize} bytes</span>
            <span className="text-success font-medium">Saved: {savings}%</span>
          </div>
          <ToolOutput label="Minified CSS" value={output} rows={6} fileName="style.min.css" mime="text/css" />
        </>
      )}
    </div>
  );
}
