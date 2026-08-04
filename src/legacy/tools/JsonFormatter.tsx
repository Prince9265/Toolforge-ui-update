// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput, ToolOutput, ToolError, ToolActions } from '@/legacy/ToolUI';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const { showToast } = useToast();

  const format = (minify = false) => {
    if (!input.trim()) {
      setError('Please enter JSON data');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : indent));
      setError('');
      showToast(minify ? 'JSON minified' : 'JSON formatted', 'success');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const stats = useMemo(() => {
    if (!output) return null;
    return { chars: output.length, lines: output.split('\n').length };
  }, [output]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={0}>Tab</option>
        </select>
      </div>

      <ToolInput
        label="Input JSON"
        value={input}
        onChange={setInput}
        placeholder='{"name":"John","age":30,"city":"New York"}'
        rows={8}
      />

      <ToolActions onReset={() => { setInput(''); setOutput(''); setError(''); }}>
        <Button onClick={() => format(false)}>Format</Button>
        <Button variant="outline" onClick={() => format(true)}>Minify</Button>
        <Button variant="outline" onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</Button>
      </ToolActions>

      {error && <ToolError message={error} />}

      {output && (
        <>
          <ToolOutput label="Formatted Output" value={output} rows={12} fileName="formatted.json" mime="application/json" />
          {stats && (
            <p className="text-xs text-muted-foreground">{stats.chars} characters · {stats.lines} lines</p>
          )}
        </>
      )}
    </div>
  );
}
