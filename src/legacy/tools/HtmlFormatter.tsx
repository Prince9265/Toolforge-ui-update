// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError } from '@/legacy/ToolUI';

export default function HtmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = (minify = false) => {
    if (!input.trim()) { setError('Please enter HTML'); setOutput(''); return; }
    try {
      const div = document.createElement('div');
      div.innerHTML = input.trim();
      const formatted = formatNode(div, 0, minify);
      setOutput(formatted.trim());
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const formatNode = (node: Node, level: number, minify: boolean): string => {
    const pad = minify ? '' : ' '.repeat(level * indent);
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? `${pad}${text}` : '';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    let attrs = '';
    for (const attr of Array.from(el.attributes)) attrs += ` ${attr.name}="${attr.value}"`;

    const children = Array.from(el.childNodes).filter((c) =>
      c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.textContent?.trim()),
    );

    if (children.length === 0) {
      return `${pad}<${tag}${attrs} />`;
    }

    const isInline = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
    if (isInline) {
      return `${pad}<${tag}${attrs}>${children[0].textContent?.trim()}</${tag}>`;
    }

    const inner = children
      .map((c) => formatNode(c, level + 1, minify))
      .filter(Boolean)
      .join(minify ? '' : '\n');
    return `${pad}<${tag}${attrs}>\n${inner}\n${pad}</${tag}>`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Indent:</label>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="h-9 rounded-lg border border-input bg-background px-2 text-sm">
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
        </select>
      </div>
      <ToolInput label="Input HTML" value={input} onChange={setInput} placeholder="<div><p>Hello</p></div>" rows={8} />
      <div className="flex gap-2">
        <Button onClick={() => format(false)}>Format</Button>
        <Button variant="outline" onClick={() => format(true)}>Minify</Button>
      </div>
      {error && <ToolError message={error} />}
      {output && <ToolOutput label="Formatted HTML" value={output} rows={10} fileName="formatted.html" mime="text/html" />}
    </div>
  );
}
