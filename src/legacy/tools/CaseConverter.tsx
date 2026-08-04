// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = (type: string) => {
    let result = input;
    switch (type) {
      case 'upper': result = input.toUpperCase(); break;
      case 'lower': result = input.toLowerCase(); break;
      case 'title': result = input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()); break;
      case 'sentence': result = input.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()); break;
      case 'camel': result = input.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toLowerCase()); break;
      case 'pascal': result = input.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase()); break;
      case 'snake': result = input.trim().replace(/\s+/g, '_').toLowerCase(); break;
      case 'kebab': result = input.trim().replace(/\s+/g, '-').toLowerCase(); break;
    }
    setOutput(result);
  };

  const buttons = [
    { label: 'UPPERCASE', type: 'upper' },
    { label: 'lowercase', type: 'lower' },
    { label: 'Title Case', type: 'title' },
    { label: 'Sentence case', type: 'sentence' },
    { label: 'camelCase', type: 'camel' },
    { label: 'PascalCase', type: 'pascal' },
    { label: 'snake_case', type: 'snake' },
    { label: 'kebab-case', type: 'kebab' },
  ];

  return (
    <div className="space-y-4">
      <ToolInput label="Input Text" value={input} onChange={setInput} placeholder="Enter text to convert..." rows={5} />
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn) => (
          <Button key={btn.type} variant="outline" size="sm" onClick={() => convert(btn.type)}>
            {btn.label}
          </Button>
        ))}
      </div>
      {output && <ToolOutput label="Result" value={output} rows={5} />}
    </div>
  );
}
