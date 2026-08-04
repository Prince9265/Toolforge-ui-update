import { type ReactNode, useState } from 'react';
import { Copy, Check, Download, Share2, RotateCcw, Link2, Mail, MessageCircle, Send, Facebook, Twitter } from 'lucide-react';
import { useCopyToClipboard } from '@/legacy/hooks/useCopyToClipboard';
import { useToast } from '@/legacy/contexts/ToastContext';
import { Button } from '@/legacy/ui/Button';

interface ToolInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
}

export function ToolInput({ value, onChange, placeholder, label, rows = 8 }: ToolInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring transition-all resize-y"
        spellCheck={false}
      />
    </div>
  );
}

interface ToolOutputProps {
  value: string;
  placeholder?: string;
  label?: string;
  rows?: number;
  fileName?: string;
  mime?: string;
  showShare?: boolean;
}

export function ToolOutput({ value, placeholder, label, rows = 8, fileName = 'output.txt', mime = 'text/plain', showShare = true }: ToolOutputProps) {
  const { copied, copy } = useCopyToClipboard();
  const { showToast } = useToast();
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleCopy = async () => {
    const ok = await copy(value);
    showToast(ok ? 'Copied to clipboard' : 'Failed to copy', ok ? 'success' : 'error');
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded', 'success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: value, title: fileName });
      } catch { /* cancelled */ }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(value.slice(0, 500));
  const shareTitle = encodeURIComponent(fileName);

  const shareLinks = [
    { icon: Twitter, label: 'Twitter', url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, color: 'hover:bg-sky-500/10 hover:text-sky-500' },
    { icon: Facebook, label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareText}`, color: 'hover:bg-blue-500/10 hover:text-blue-500' },
    { icon: Send, label: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`, color: 'hover:bg-cyan-500/10 hover:text-cyan-500' },
    { icon: MessageCircle, label: 'WhatsApp', url: `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`, color: 'hover:bg-green-500/10 hover:text-green-500' },
    { icon: Mail, label: 'Email', url: `mailto:?subject=${shareTitle}&body=${shareText}`, color: 'hover:bg-amber-500/10 hover:text-amber-500' },
  ];

  const copyShareLink = async () => {
    await copy(shareUrl);
    showToast('Share link copied', 'success');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="text-sm font-medium text-foreground">{label}</label>}
        <div className="flex items-center gap-1 relative">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!value} aria-label="Copy">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!value} aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
          {showShare && (
            <>
              <Button variant="ghost" size="sm" onClick={handleShare} disabled={!value} aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 rounded-lg border border-border bg-popover shadow-xl p-2 z-50 animate-scale-in min-w-[200px]">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">Share via</p>
                  {shareLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors ${s.color}`}
                    >
                      <s.icon className="h-4 w-4" />
                      {s.label}
                    </a>
                  ))}
                  <button onClick={copyShareLink} className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm transition-colors hover:bg-muted">
                    <Link2 className="h-4 w-4" />
                    Copy link
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <textarea
        value={value}
        readOnly
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-input bg-muted/30 px-4 py-3 font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring transition-all resize-y"
        spellCheck={false}
      />
    </div>
  );
}

interface ToolActionsProps {
  onReset?: () => void;
  onRepeat?: () => void;
  children?: ReactNode;
}

export function ToolActions({ onReset, onRepeat, children }: ToolActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {onRepeat && (
        <Button variant="outline" size="sm" onClick={onRepeat}>
          <RotateCcw className="h-4 w-4" />
          Run Again
        </Button>
      )}
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}

export function ToolError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-fade-in">
      <span className="font-semibold">Error:</span>
      <span>{message}</span>
    </div>
  );
}

export function ToolEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function useToolState() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return { input, setInput, output, setOutput, error, setError, reset };
}
