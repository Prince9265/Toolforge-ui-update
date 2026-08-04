// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolOutput } from '@/legacy/ToolUI';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    let result = '';
    if (type === 'paragraphs') {
      for (let p = 0; p < count; p++) {
        const sentences = 4 + Math.floor(Math.random() * 4);
        for (let s = 0; s < sentences; s++) {
          const wordCount = 8 + Math.floor(Math.random() * 12);
          let sentence = '';
          for (let w = 0; w < wordCount; w++) {
            sentence += WORDS[Math.floor(Math.random() * WORDS.length)] + ' ';
          }
          sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '. ';
          result += sentence;
        }
        result += '\n\n';
      }
    } else if (type === 'sentences') {
      for (let s = 0; s < count; s++) {
        const wordCount = 8 + Math.floor(Math.random() * 12);
        let sentence = '';
        for (let w = 0; w < wordCount; w++) {
          sentence += WORDS[Math.floor(Math.random() * WORDS.length)] + ' ';
        }
        result += sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + '. ';
      }
    } else {
      for (let w = 0; w < count; w++) {
        result += WORDS[Math.floor(Math.random() * WORDS.length)] + ' ';
      }
      result = result.charAt(0).toUpperCase() + result.slice(1).trim() + '.';
    }
    setOutput(result.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="h-10 w-24 rounded-lg border border-input bg-background px-3 text-sm" />
        <Button onClick={generate}>Generate</Button>
      </div>
      {output && <ToolOutput label="Generated Text" value={output} rows={10} fileName="lorem-ipsum.txt" />}
    </div>
  );
}
