// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput, ToolError } from '@/legacy/ToolUI';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format (expected 3 parts)');
      const decodeB64 = (s: string) => {
        const normalized = s.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '=='.slice(0, (4 - (normalized.length % 4)) % 4);
        return decodeURIComponent(escape(atob(padded)));
      };
      const header = JSON.parse(decodeB64(parts[0]));
      const payload = JSON.parse(decodeB64(parts[1]));
      const isExpired = payload.exp ? Date.now() >= payload.exp * 1000 : false;
      return { header, payload, signature: parts[2], isExpired };
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <ToolInput label="JWT Token" value={token} onChange={(v) => { setToken(v); setError(''); }} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." rows={4} />

      {error && <ToolError message={error} />}

      {decoded && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Header</h3>
            <pre className="rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono overflow-x-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Payload</h3>
            <pre className="rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono overflow-x-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Signature</h3>
            <code className="block rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono break-all">{decoded.signature}</code>
          </div>
          {decoded.isExpired !== null && (
            <div className={`rounded-lg border px-4 py-2 text-sm ${decoded.isExpired ? 'border-destructive/30 bg-destructive/5 text-destructive' : 'border-success/30 bg-success/5 text-success'}`}>
              {decoded.isExpired ? 'Token is EXPIRED' : 'Token is NOT expired'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
