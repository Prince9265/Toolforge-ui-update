// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (!input) { setHashes({}); return; }
    (async () => {
      const enc = new TextEncoder().encode(input);
      const algorithms: Record<string, string> = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-512': 'SHA-512' };
      const results: Record<string, string> = {};
      for (const [name, algo] of Object.entries(algorithms)) {
        try {
          const buf = await crypto.subtle.digest(algo, enc);
          results[name] = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch { results[name] = 'Error'; }
      }
      // MD5 fallback (simple implementation)
      results['MD5'] = md5(input);
      setHashes(results);
    })();
  }, [input]);

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopiedKey(key);
    showToast(`${key} copied`, 'success');
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring resize-y"
          spellCheck={false}
        />
      </div>

      {Object.entries(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{algo}</span>
                <button onClick={() => copy(algo, hash)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`Copy ${algo}`}>
                  {copiedKey === algo ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <code className="block w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-xs break-all">{hash}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple MD5 implementation
function md5(input: string): string {
  function toBytes(str: string): number[] {
    const result: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c < 128) result.push(c);
      else if (c < 2048) { result.push(0xc0 | (c >> 6)); result.push(0x80 | (c & 0x3f)); }
      else { result.push(0xe0 | (c >> 12)); result.push(0x80 | ((c >> 6) & 0x3f)); result.push(0x80 | (c & 0x3f)); }
    }
    return result;
  }

  const bytes = toBytes(input);
  const len = bytes.length;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const bitLen = len * 8;
  for (let i = 0; i < 8; i++) bytes.push((bitLen >>> (8 * i)) & 0xff);

  const s = (n: number, c: number) => ((n << c) | (n >>> (32 - c))) >>> 0;
  const a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const K = [0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391];

  let A = a0, B = b0, C = c0, D = d0;
  for (let off = 0; off < bytes.length; off += 64) {
    const M = new Array(16);
    for (let i = 0; i < 16; i++) M[i] = bytes[off + i * 4] | (bytes[off + i * 4 + 1] << 8) | (bytes[off + i * 4 + 2] << 16) | (bytes[off + i * 4 + 3] << 24);
    let [a, b, c, d] = [A, B, C, D];
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (b & c) | (~b & d); g = i; }
      else if (i < 32) { F = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { F = c ^ (b | ~d); g = (7 * i) % 16; }
      F = (F + a + K[i] + M[g]) >>> 0;
      a = d; d = c; c = b; b = (b + s(F, S[i])) >>> 0;
    }
    A = (A + a) >>> 0; B = (B + b) >>> 0; C = (C + c) >>> 0; D = (D + d) >>> 0;
  }

  const toHex = (n: number) => {
    let h = '';
    for (let i = 0; i < 4; i++) h += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    return h;
  };
  return toHex(A) + toHex(B) + toHex(C) + toHex(D);
}
