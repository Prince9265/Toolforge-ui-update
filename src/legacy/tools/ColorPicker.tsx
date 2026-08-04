// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState('');
  const { showToast } = useToast();

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const values = {
    HEX: color.toUpperCase(),
    RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    showToast(`${key} copied`, 'success');
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-20 w-20 rounded-lg border border-border cursor-pointer" />
        <div className="flex-1 w-full rounded-lg border border-border p-4" style={{ backgroundColor: color }}>
          <p className="text-sm font-mono text-white mix-blmd-contrast">{color.toUpperCase()}</p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(values).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <span className="text-sm font-medium w-12">{key}</span>
            <code className="flex-1 font-mono text-sm">{val}</code>
            <button onClick={() => copy(key, val)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`Copy ${key}`}>
              {copied === key ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Or enter a HEX color:</label>
        <input type="text" value={color} onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v); }} className="h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm" placeholder="#3b82f6" />
      </div>
    </div>
  );
}
