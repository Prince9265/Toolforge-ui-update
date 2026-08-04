// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError, ToolActions } from '@/legacy/ToolUI';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = (minify = false) => {
    if (!input.trim()) {
      setError('Please enter XML data');
      setOutput('');
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) throw new Error('Invalid XML: ' + parseError.textContent);

      const serialize = (node: Node, level: number): string => {
        const indent = minify ? '' : '  '.repeat(level);
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          let result = `${indent}<${el.tagName}`;
          for (const attr of Array.from(el.attributes)) {
            result += ` ${attr.name}="${attr.value}"`;
          }
          const children = Array.from(el.childNodes).filter(
            (c) => c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.textContent?.trim()),
          );
          if (children.length === 0) {
            result += '/>';
          } else if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
            result += `>${children[0].textContent}</${el.tagName}>`;
          } else {
            result += '>\n';
            for (const child of children) {
              result += serialize(child, level + 1) + '\n';
            }
            result += `${indent}</${el.tagName}>`;
          }
          return result;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return `${indent}${node.textContent?.trim()}`;
        }
        return '';
      };

      const formatted = Array.from(doc.childNodes)
        .map((node) => serialize(node, 0))
        .filter(Boolean)
        .join('\n');
      setOutput(formatted);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput
        label="Input XML"
        value={input}
        onChange={setInput}
        placeholder='<root><item>Hello</item></root>'
        rows={8}
      />

      <ToolActions onReset={() => { setInput(''); setOutput(''); setError(''); }}>
        <Button onClick={() => format(false)}>Format</Button>
        <Button variant="outline" onClick={() => format(true)}>Minify</Button>
      </ToolActions>

      {error && <ToolError message={error} />}

      {output && (
        <ToolOutput label="Formatted XML" value={output} rows={12} fileName="formatted.xml" mime="application/xml" />
      )}
    </div>
  );
}
