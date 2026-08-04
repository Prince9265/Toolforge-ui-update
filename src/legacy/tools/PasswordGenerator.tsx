// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useCallback } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const generate = useCallback(() => {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (excludeAmbiguous) chars = chars.replace(/[O0Il1|`'"]/g, '');
    if (!chars) { setPassword(''); return; }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  }, [length, upper, lower, numbers, symbols, excludeAmbiguous]);

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    showToast('Password copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = password.length >= 16 && upper && lower && numbers && symbols ? 'Strong' : password.length >= 12 ? 'Medium' : 'Weak';
  const strengthColor = strength === 'Strong' ? 'text-success' : strength === 'Medium' ? 'text-warning' : 'text-destructive';

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <code className="flex-1 font-mono text-lg break-all">{password || 'Click generate...'}</code>
          <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" aria-label="Copy password">
            {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        {password && <p className={`text-xs mt-2 ${strengthColor}`}>Strength: {strength}</p>}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Length: {length}</label>
          <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-primary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Uppercase (A-Z)', val: upper, set: setUpper },
            { label: 'Lowercase (a-z)', val: lower, set: setLower },
            { label: 'Numbers (0-9)', val: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', val: symbols, set: setSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
          <span className="text-sm">Exclude ambiguous characters (O, 0, l, 1, I)</span>
        </label>
      </div>

      <Button onClick={generate} className="w-full">
        <RefreshCw className="h-4 w-4" />
        Generate Password
      </Button>
    </div>
  );
}
