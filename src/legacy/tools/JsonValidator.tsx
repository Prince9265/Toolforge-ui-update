// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { ToolInput } from '@/legacy/ToolUI';
import { Check, X } from 'lucide-react';

export default function JsonValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string; error?: string } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult({ valid: false, message: 'Please enter JSON data to validate' });
      return;
    }
    try {
      JSON.parse(input);
      setResult({ valid: true, message: 'Valid JSON! No errors found.' });
    } catch (e) {
      setResult({ valid: false, message: 'Invalid JSON', error: (e as Error).message });
    }
  };

  return (
    <div className="space-y-4">
      <ToolInput
        label="JSON to Validate"
        value={input}
        onChange={setInput}
        placeholder='{"key": "value"}'
        rows={10}
      />

      <Button onClick={validate}>Validate JSON</Button>

      {result && (
        <div className={`flex items-start gap-3 rounded-lg border p-4 animate-fade-in ${result.valid ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
          {result.valid ? (
            <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
          ) : (
            <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm font-medium ${result.valid ? 'text-success' : 'text-destructive'}`}>{result.message}</p>
            {result.error && <p className="text-xs text-destructive mt-1">{result.error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
