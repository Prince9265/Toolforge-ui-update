// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolActions } from '@/legacy/ToolUI';

export default function TextSummarizer() {
  const [text, setText] = useState('');
  const [sentences, setSentences] = useState(3);
  const [output, setOutput] = useState('');

  const summarize = useMemo(() => {
    if (!text.trim()) return '';
    const sents = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (sents.length <= sentences) return text;

    const wordFreq: Record<string, number> = {};
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    for (const w of words) if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;
    const maxFreq = Math.max(...Object.values(wordFreq), 1);

    const scored = sents.map((s, i) => {
      const sWords = s.toLowerCase().match(/\b\w+\b/g) || [];
      let score = 0;
      for (const w of sWords) score += (wordFreq[w] || 0) / maxFreq;
      score = score / Math.sqrt(sWords.length || 1);
      score += (1 - i / sents.length) * 0.1;
      return { sentence: s.trim(), score, index: i };
    });

    const top = [...scored].sort((a, b) => b.score - a.score).slice(0, sentences).sort((a, b) => a.index - b.index);
    return top.map((t) => t.sentence).join(' ');
  }, [text, sentences]);

  const run = () => setOutput(summarize);

  return (
    <div className="space-y-4">
      <ToolInput label="Text to Summarize" value={text} onChange={setText} placeholder="Paste your long text here..." rows={8} />
      <div>
        <label className="text-sm font-medium mb-2 block">Summary Length: {sentences} sentences</label>
        <input type="range" min="1" max="10" value={sentences} onChange={(e) => setSentences(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <ToolActions onRepeat={run} onReset={() => { setText(''); setOutput(''); }}>
        <Button onClick={run}>Summarize</Button>
      </ToolActions>
      {output && <ToolOutput label="Summary" value={output} rows={6} fileName="summary.txt" />}
    </div>
  );
}
