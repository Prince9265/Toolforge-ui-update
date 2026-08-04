// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput } from '@/legacy/ToolUI';

export default function ReadingTimeCalculator() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readingMinutes = words / wpm;
    const speakingMinutes = words / 130;
    return {
      words,
      readingTime: Math.ceil(readingMinutes),
      speakingTime: Math.ceil(speakingMinutes),
    };
  }, [text, wpm]);

  return (
    <div className="space-y-4">
      <ToolInput label="Your Text" value={text} onChange={setText} placeholder="Paste your text to calculate reading time..." rows={8} />
      <div>
        <label className="text-sm font-medium mb-2 block">Reading Speed: {wpm} words/min</label>
        <input type="range" min="100" max="400" step="10" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full accent-primary" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-primary/5 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Reading Time</p><p className="text-2xl font-bold text-primary">{stats.readingTime}</p><p className="text-xs text-muted-foreground">min</p></div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Speaking Time</p><p className="text-2xl font-bold">{stats.speakingTime}</p><p className="text-xs text-muted-foreground">min</p></div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Word Count</p><p className="text-2xl font-bold">{stats.words}</p><p className="text-xs text-muted-foreground">words</p></div>
      </div>
    </div>
  );
}
