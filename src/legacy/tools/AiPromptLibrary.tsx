// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Copy, Check, Search } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

const library = [
  { category: 'Writing', title: 'Blog Post Writer', prompt: 'Write a comprehensive blog post about [TOPIC]. Include: an engaging introduction, 3-5 main sections with subheadings, practical examples, a conclusion with key takeaways. Target audience: [AUDIENCE]. Tone: informative and engaging. Length: 1500-2000 words.' },
  { category: 'Writing', title: 'Email Composer', prompt: 'Write a professional email to [RECIPIENT] about [SUBJECT]. The email should be concise, polite, and clearly state the purpose. Include a clear subject line and call to action. Tone: professional but friendly.' },
  { category: 'Coding', title: 'Code Reviewer', prompt: 'Review the following code for: 1) Bugs and potential errors 2) Performance issues 3) Code style and best practices 4) Security concerns. Provide specific suggestions for improvement with code examples.\n\nCode:\n[CODE]' },
  { category: 'Coding', title: 'Bug Fixer', prompt: 'Debug the following code. Identify the bug, explain why it occurs, and provide the fixed code with comments explaining the changes.\n\nCode:\n[CODE]\n\nError description: [ERROR]' },
  { category: 'Marketing', title: 'Ad Copy Generator', prompt: 'Write 5 variations of ad copy for [PRODUCT/SERVICE]. Each variation should: target a different pain point, use persuasive language, include a strong CTA, and be under 100 characters. Platform: [PLATFORM].' },
  { category: 'Marketing', title: 'SEO Content', prompt: 'Create SEO-optimized content about [TOPIC]. Target keyword: [KEYWORD]. Include: meta title (60 chars), meta description (155 chars), H1, H2s, naturally distributed keywords, and internal linking suggestions. Length: 1000 words.' },
  { category: 'Business', title: 'Business Plan', prompt: 'Create a lean business plan for [BUSINESS IDEA]. Include: problem, solution, target market, revenue model, competitive advantage, key metrics, and 12-month milestones.' },
  { category: 'Business', title: 'Meeting Notes', prompt: 'Organize the following meeting notes into a structured format with: attendees, agenda items, key decisions, action items (with owners and deadlines), and next steps.\n\nRaw notes:\n[NOTES]' },
  { category: 'Education', title: 'Concept Explainer', prompt: 'Explain [CONCEPT] as if teaching a beginner. Use: simple analogies, real-world examples, step-by-step breakdown, and a summary. Avoid jargon unless explained.' },
  { category: 'Education', title: 'Quiz Generator', prompt: 'Generate a 10-question quiz about [TOPIC]. Include: 5 multiple choice questions (4 options each), 3 true/false questions, 2 short answer questions. Provide an answer key with explanations.' },
  { category: 'Creative', title: 'Story Writer', prompt: 'Write a short story about [THEME]. Genre: [GENRE]. Length: 1000 words. Include: compelling characters, vivid descriptions, dialogue, and a surprising twist ending.' },
  { category: 'Creative', title: 'Poem Generator', prompt: 'Write a poem about [TOPIC] in [STYLE] style. Use vivid imagery, metaphor, and emotional resonance. Length: 4-8 stanzas.' },
  { category: 'Productivity', title: 'Task Breakdown', prompt: 'Break down the following project into actionable tasks: [PROJECT]. For each task provide: description, estimated time, priority (high/medium/low), dependencies, and definition of done.' },
  { category: 'Productivity', title: 'Decision Matrix', prompt: 'Help me decide between [OPTIONS]. Create a decision matrix evaluating each option on: cost, time, effort, risk, and potential impact. Score each 1-10 and recommend the best option with reasoning.' },
];

export default function AiPromptLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    return library.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.prompt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category]);

  const categories = ['All', ...new Set(library.map((p) => p.category))];

  const copy = async (prompt: string, idx: number) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    showToast('Prompt copied to clipboard', 'success');
    setTimeout(() => setCopiedIdx(-1), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search prompts..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((p, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 card-hover">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{p.category}</span>
              <button onClick={() => copy(p.prompt, i)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy prompt">
                {copiedIdx === i ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <h3 className="text-sm font-semibold mb-2">{p.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-3 font-mono">{p.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
