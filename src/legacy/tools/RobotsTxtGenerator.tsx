// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function RobotsTxtGenerator() {
  const [allowAll, setAllowAll] = useState(true);
  const [disallowedPaths, setDisallowedPaths] = useState('/admin, /private');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const output = useMemo(() => {
    const lines: string[] = ['User-agent: *'];
    if (allowAll) {
      lines.push('Allow: /');
      if (disallowedPaths.trim()) {
        for (const path of disallowedPaths.split(',').map((p) => p.trim()).filter(Boolean)) {
          lines.push(`Disallow: ${path}`);
        }
      }
    } else {
      lines.push('Disallow: /');
    }
    if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
    if (sitemap.trim()) lines.push('', `Sitemap: ${sitemap}`);
    return lines.join('\n');
  }, [allowAll, disallowedPaths, sitemap, crawlDelay]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('robots.txt copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Allow all crawlers</span></label>
    <div><label className="text-sm font-medium mb-2 block">Disallowed Paths (comma-separated)</label><input type="text" value={disallowedPaths} onChange={(e) => setDisallowedPaths(e.target.value)} disabled={!allowAll} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm disabled:opacity-50" /></div>
    <div><label className="text-sm font-medium mb-2 block">Sitemap URL</label><input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" /></div>
    <div><label className="text-sm font-medium mb-2 block">Crawl Delay (seconds, optional)</label><input type="text" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="e.g. 10" /></div>
    <div><div className="flex items-center justify-between mb-2"><label className="text-sm font-medium">robots.txt</label><button onClick={copy} className="text-muted-foreground hover:text-foreground" aria-label="Copy">{copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}</button></div><pre className="rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{output}</pre></div>
    </div>
  );
}
