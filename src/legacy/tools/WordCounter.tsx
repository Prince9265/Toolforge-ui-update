// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput } from '@/legacy/ToolUI';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const readingTime = Math.ceil(words / 200);
    return { words, chars, charsNoSpace, sentences, paragraphs, lines, readingTime };
  }, [text]);

  const items = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Characters (no spaces)', value: stats.charsNoSpace },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Lines', value: stats.lines },
    { label: 'Reading Time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="space-y-4">
      <ToolInput label="Your Text" value={text} onChange={setText} placeholder="Type or paste your text here..." rows={8} />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-primary">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
