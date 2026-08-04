// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const output = useMemo(() => {
    const tags: string[] = [];
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (url) tags.push(`<link rel="canonical" href="${url}">`);
    if (title) tags.push(`<meta property="og:title" content="${title}">`);
    if (description) tags.push(`<meta property="og:description" content="${description}">`);
    if (url) tags.push(`<meta property="og:url" content="${url}">`);
    if (image) tags.push(`<meta property="og:image" content="${image}">`);
    tags.push('<meta property="og:type" content="website">');
    if (title) tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}">`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}">`);
    if (image) tags.push(`<meta name="twitter:image" content="${image}">`);
    return tags.join('\n');
  }, [title, description, keywords, url, image]);

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('Meta tags copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-sm font-medium mb-2 block">Page Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="My Awesome Page" /></div>
        <div><label className="text-sm font-medium mb-2 block">URL (Canonical)</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="https://example.com/page" /></div>
        <div className="sm:col-span-2"><label className="text-sm font-medium mb-2 block">Description</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="A brief description of your page" /></div>
        <div><label className="text-sm font-medium mb-2 block">Keywords (comma-separated)</label><input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="keyword1, keyword2" /></div>
        <div><label className="text-sm font-medium mb-2 block">Image URL (OG)</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder="https://example.com/image.png" /></div>
      </div>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium">Generated Meta Tags</label><button onClick={copy} className="text-muted-foreground hover:text-foreground" aria-label="Copy">{copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}</button></div>
          <pre className="rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
