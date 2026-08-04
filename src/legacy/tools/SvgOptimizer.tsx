// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function SvgOptimizer() {
  const [input, setInput] = useState('');

  const { output, originalSize, newSize } = useMemo(() => {
    if (!input.trim()) return { output: '', originalSize: 0, newSize: 0 };
    let svg = input;
    // Remove comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');
    // Remove XML declaration
    svg = svg.replace(/<\?xml[^>]*\?>/g, '');
    // Remove metadata
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/g, '');
    // Remove editor data
    svg = svg.replace(/<sodipodi[\s\S]*?<\/sodipodi>/g, '').replace(/<inkscape[\s\S]*?<\/inkscape>/g, '');
    // Strip whitespace between tags
    svg = svg.replace(/>\s+</g, '><');
    // Collapse multiple spaces
    svg = svg.replace(/\s+/g, ' ');
    // Remove spaces around = and /
    svg = svg.replace(/\s*=\s*/g, '=').replace(/\s+\/>/g, '/>');
    // Remove trailing space before >
    svg = svg.replace(/\s+>/g, '>');
    svg = svg.trim();
    return { output: svg, originalSize: input.length, newSize: svg.length };
  }, [input]);

  const savings = originalSize > 0 ? Math.round((1 - newSize / originalSize) * 100) : 0;

  return (
    <div className="space-y-4">
      <ToolInput label="Input SVG" value={input} onChange={setInput} placeholder="<svg>...</svg>" rows={6} />
      {output && (
        <>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Original: {originalSize} bytes</span>
            <span className="text-muted-foreground">Optimized: {newSize} bytes</span>
            <span className="text-success font-medium">Saved: {savings}%</span>
          </div>
          <ToolOutput label="Optimized SVG" value={output} rows={6} fileName="optimized.svg" mime="image/svg+xml" />
        </>
      )}
    </div>
  );
}
