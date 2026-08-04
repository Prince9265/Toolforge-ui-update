// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { ToolInput, ToolOutput, ToolActions } from '@/legacy/ToolUI';
import { Button } from '@/legacy/ui/Button';

const styles = [
  { id: 'role', label: 'Role-Based', template: (t: string) => `You are an expert assistant. Your task: ${t}\n\nPlease provide a detailed, well-structured response. Consider edge cases and provide examples where appropriate.` },
  { id: 'step', label: 'Step-by-Step', template: (t: string) => `Task: ${t}\n\nPlease break this down into clear steps:\n1. Analyze the request\n2. Plan the approach\n3. Execute step by step\n4. Verify the result\n\nProvide your response in a structured format.` },
  { id: 'creative', label: 'Creative', template: (t: string) => `Imagine you are a creative professional with 20 years of experience. ${t}\n\nThink outside the box. Provide innovative, unexpected solutions. Don't be afraid to suggest unconventional approaches.` },
  { id: 'analytical', label: 'Analytical', template: (t: string) => `Analyze the following request with rigorous attention to detail: ${t}\n\nProvide:\n- Key considerations\n- Potential risks\n- Data-driven recommendations\n- Measurable outcomes` },
  { id: 'socratic', label: 'Socratic', template: (t: string) => `Before answering "${t}", please:\n1. Ask clarifying questions if the request is ambiguous\n2. Consider multiple perspectives\n3. Identify assumptions\n4. Provide a nuanced answer acknowledging complexity` },
];

export default function AiPromptGenerator() {
  const [task, setTask] = useState('');
  const [style, setStyle] = useState('role');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!task.trim()) return;
    const s = styles.find((s) => s.id === style);
    setOutput(s ? s.template(task) : '');
  };

  return (
    <div className="space-y-4">
      <ToolInput label="What do you want the AI to do?" value={task} onChange={setTask} placeholder="e.g. Write a blog post about renewable energy" rows={3} />
      <div>
        <label className="text-sm font-medium mb-2 block">Prompt Style</label>
        <div className="flex flex-wrap gap-2">
          {styles.map((s) => (
            <Button key={s.id} variant={style === s.id ? 'primary' : 'outline'} size="sm" onClick={() => setStyle(s.id)}>{s.label}</Button>
          ))}
        </div>
      </div>
      <ToolActions onRepeat={generate} onReset={() => { setTask(''); setOutput(''); }}>
        <Button onClick={generate}>Generate Prompt</Button>
      </ToolActions>
      {output && <ToolOutput label="Generated Prompt" value={output} rows={10} fileName="prompt.txt" />}
    </div>
  );
}
