// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput, ToolOutput } from '@/legacy/ToolUI';

export default function MarkdownPreview() {
  const [input, setInput] = useState('# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n```\ncode block\n```');

  const html = useMemo(() => {
    let result = input;
    // Code blocks
    result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => `<pre class="bg-muted p-3 rounded-lg overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>`);
    // Inline code
    result = result.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded font-mono text-sm">$1</code>');
    // Headers
    result = result.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    result = result.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>');
    result = result.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
    // Bold and italic
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
    // Blockquote
    result = result.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground">$1</blockquote>');
    // Lists
    result = result.replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>');
    result = result.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 list-decimal">$2</li>');
    // Paragraphs
    result = result.replace(/\n\n/g, '</p><p class="mb-4">');
    result = `<div class="prose-content"><p class="mb-4">${result}</p></div>`;
    return result;
  }, [input]);

  function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <ToolInput label="Markdown Input" value={input} onChange={setInput} rows={14} />
      <div>
        <label className="text-sm font-medium mb-2 block">Preview</label>
        <div className="rounded-lg border border-input bg-muted/30 p-4 min-h-[200px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-4">
          <ToolOutput label="HTML Output" value={html} rows={6} fileName="output.html" mime="text/html" />
        </div>
      </div>
    </div>
  );
}
