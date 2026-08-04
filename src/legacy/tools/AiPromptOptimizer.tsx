// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { ToolInput, ToolOutput, ToolActions } from '@/legacy/ToolUI';
import { Button } from '@/legacy/ui/Button';

export default function AiPromptOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const optimize = () => {
    if (!input.trim()) return;
    const enhanced = `## Role
You are an expert assistant with deep knowledge and experience in the relevant domain.

## Task
${input}

## Context
- The user needs a comprehensive, well-structured response
- Consider edge cases and potential pitfalls
- Provide actionable, practical advice

## Constraints
- Be specific and avoid vague generalizations
- If unsure about any aspect, state your assumptions
- Provide examples where helpful

## Output Format
- Use clear headings and bullet points
- Start with a brief summary
- End with key takeaways

## Quality Checks
- Is the response complete?
- Is it accurate and up-to-date?
- Is it easy to understand?`;
    setOutput(enhanced);
  };

  return (
    <div className="space-y-4">
      <ToolInput label="Your Basic Prompt" value={input} onChange={setInput} placeholder="e.g. Write a product description for a coffee mug" rows={4} />
      <ToolActions onRepeat={optimize} onReset={() => { setInput(''); setOutput(''); }}>
        <Button onClick={optimize}>Optimize Prompt</Button>
      </ToolActions>
      {output && <ToolOutput label="Optimized Prompt" value={output} rows={14} fileName="optimized-prompt.txt" />}
    </div>
  );
}
