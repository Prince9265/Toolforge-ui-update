import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  CopyButton,
  ErrorNote,
  Panel,
  ProcessingOverlay,
  ResetButton,
  TextField,
  downloadBlob,
  useProcessing,
} from "@/components/tool-ui";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed."))),
      type,
      quality,
    ),
  );
}

const formatLabel = { "image/webp": "WebP", "image/jpeg": "JPG", "image/png": "PNG" } as const;
type Format = keyof typeof formatLabel;

function prettyBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("image/webp");
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { processing, run } = useProcessing(1500);

  const compress = async () => {
    if (!file) return;
    setError(null);
    const output = await run(async () => {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, format, quality / 100);
      return {
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${file.name.replace(/\.[^.]+$/, "")}.${format.split("/")[1]}`,
      };
    });
    if (output) setResult(output);
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Source image"
        actions={
          <ResetButton
            onReset={() => {
              setFile(null);
              setResult(null);
            }}
            label="Reset"
          />
        }
      >
        <Label htmlFor="compress-file">Choose an image</Label>
        <Input
          id="compress-file"
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setResult(null);
          }}
        />
        {file && (
          <p className="mt-2 text-sm text-muted-foreground">
            {file.name} · {prettyBytes(file.size)}
          </p>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Output format</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(formatLabel) as Format[]).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={format === f ? "default" : "outline"}
                  onClick={() => setFormat(f)}
                >
                  {formatLabel[f]}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="quality">Quality · {quality}%</Label>
            <Slider
              id="quality"
              className="mt-4"
              min={10}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={([v]) => setQuality(v ?? 75)}
            />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={compress} disabled={!file || processing}>
            Compress image
          </Button>
        </div>
        <ProcessingOverlay active={processing} label="Encoding in your browser…" />
        <ErrorNote message={error} />
      </Panel>

      {result && (
        <Panel
          title={`Result · ${prettyBytes(result.size)}${
            file ? ` (${Math.max(0, Math.round((1 - result.size / file.size) * 100))}% smaller)` : ""
          }`}
        >
          <img
            src={result.url}
            alt="Compressed preview"
            className="max-h-80 w-full rounded-lg object-contain"
          />
          <div className="mt-6">
            <Button asChild>
              <a href={result.url} download={result.name}>
                Download {formatLabel[format]}
              </a>
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState<Format>("image/png");
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const { processing, run } = useProcessing(1500);

  useEffect(() => {
    if (!file) return;
    loadImage(file).then((img) => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    });
  }, [file]);

  const ratio = natural ? natural.w / natural.h : 1;

  const resize = async () => {
    if (!file) return;
    const output = await run(async () => {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      const blob = await canvasToBlob(canvas, format, 0.92);
      return {
        url: URL.createObjectURL(blob),
        name: `${file.name.replace(/\.[^.]+$/, "")}-${canvas.width}x${canvas.height}.${format.split("/")[1]}`,
      };
    });
    if (output) setResult(output);
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Image"
        actions={
          <ResetButton
            onReset={() => {
              setFile(null);
              setResult(null);
              setNatural(null);
            }}
          />
        }
      >
        <Label htmlFor="resize-file">Choose an image</Label>
        <Input
          id="resize-file"
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {natural && (
          <p className="mt-2 text-sm text-muted-foreground">
            Original: {natural.w} × {natural.h} px
          </p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="resize-w">Width (px)</Label>
            <Input
              id="resize-w"
              type="number"
              value={width}
              onChange={(e) => {
                const w = Number(e.target.value) || 0;
                setWidth(w);
                if (lock) setHeight(Math.round(w / ratio));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resize-h">Height (px)</Label>
            <Input
              id="resize-h"
              type="number"
              value={height}
              onChange={(e) => {
                const h = Number(e.target.value) || 0;
                setHeight(h);
                if (lock) setWidth(Math.round(h * ratio));
              }}
            />
          </div>
          <div className="flex items-end">
            <Button variant={lock ? "default" : "outline"} onClick={() => setLock(!lock)}>
              {lock ? "Ratio locked" : "Ratio free"}
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(formatLabel) as Format[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={format === f ? "default" : "outline"}
              onClick={() => setFormat(f)}
            >
              {formatLabel[f]}
            </Button>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={resize} disabled={!file || processing}>
            Resize & convert
          </Button>
        </div>
        <ProcessingOverlay active={processing} />
      </Panel>

      {result && (
        <Panel title="Result">
          <img
            src={result.url}
            alt="Resized preview"
            className="max-h-80 w-full rounded-lg object-contain"
          />
          <div className="mt-6">
            <Button asChild>
              <a href={result.url} download={result.name}>
                Download image
              </a>
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}

export function SvgPngConverter() {
  const [svg, setSvg] = useState(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="100" cy="100" r="80" fill="#f97316"/></svg>',
  );
  const [scale, setScale] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const { processing, run } = useProcessing(1200);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toPng = async () => {
    setError(null);
    await run(async () => {
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Invalid SVG markup."));
        img.src = url;
      });
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvas.width = (img.width || 300) * scale;
      canvas.height = (img.height || 300) * scale;
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const png = await canvasToBlob(canvas, "image/png", 1);
      downloadBlob(png, "converted.png");
    });
  };

  const pngToSvg = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      const img = new Image();
      img.onload = () => {
        const wrapped = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}"><image href="${dataUrl}" width="${img.width}" height="${img.height}"/></svg>`;
        setSvg(wrapped);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <Panel
        title="SVG markup"
        actions={
          <>
            <CopyButton value={svg} />
            <ResetButton onReset={() => setSvg("")} label="Clear" />
          </>
        }
      >
        <TextField label="Paste SVG" value={svg} onChange={setSvg} rows={10} />
        <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="svg-scale">Scale ×{scale}</Label>
            <Slider
              id="svg-scale"
              min={1}
              max={8}
              step={1}
              value={[scale]}
              onValueChange={([v]) => setScale(v ?? 2)}
            />
          </div>
          <div>
            <Button onClick={toPng} disabled={processing}>
              Convert SVG → PNG
            </Button>
          </div>
        </div>
        <ProcessingOverlay active={processing} label="Rasterising…" />
        <ErrorNote message={error} />
        <canvas ref={canvasRef} className="hidden" />
      </Panel>

      <Panel title="PNG → SVG">
        <Label htmlFor="png-file">Wrap a raster image inside an SVG container</Label>
        <Input
          id="png-file"
          type="file"
          accept="image/png,image/jpeg"
          className="mt-2"
          onChange={(e) => pngToSvg(e.target.files?.[0])}
        />
      </Panel>

      <Panel title="Live preview">
        <div
          className="grid min-h-40 place-items-center rounded-lg bg-background/60 p-4 [&_svg]:max-h-64"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </Panel>
    </div>
  );
}

/* ------------------------------- Color studio -------------------------------- */

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0");
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number) {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

export function ColorStudio() {
  const [color, setColor] = useState("#f97316");
  const [second, setSecond] = useState("#0ea5e9");
  const [angle, setAngle] = useState(135);

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const shades = useMemo(
    () =>
      [95, 85, 75, 65, 55, 45, 35, 25, 15].map((l) => hslToHex(hsl.h, Math.max(hsl.s, 20), l)),
    [hsl],
  );
  const harmonies = useMemo(
    () =>
      [0, 30, 180, 210, 120, 240].map((offset) => hslToHex((hsl.h + offset) % 360, hsl.s, hsl.l)),
    [hsl],
  );
  const gradientCss = `background-image: linear-gradient(${angle}deg, ${color}, ${second});`;

  return (
    <div className="space-y-4">
      <Panel title="Pick a color">
        <div className="grid gap-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center">
          <input
            type="color"
            aria-label="Color picker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-28 w-full cursor-pointer rounded-xl border border-border bg-transparent"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["HEX", color.toUpperCase()],
              ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
              ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-background/60 p-3">
                <p className="text-xs uppercase text-muted-foreground">{label}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <code className="truncate text-sm">{value}</code>
                  <CopyButton value={value!} label="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Tints & shades">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
          {shades.map((shade) => (
            <button
              key={shade}
              type="button"
              onClick={() => setColor(shade)}
              className="h-16 rounded-lg border border-border text-[10px] font-medium text-foreground/70"
              style={{ backgroundColor: shade }}
              aria-label={`Use ${shade}`}
            >
              {shade}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Palette">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
          {harmonies.map((hex, i) => (
            <div key={`${hex}-${i}`} className="overflow-hidden rounded-lg border border-border">
              <div className="h-16" style={{ backgroundColor: hex }} />
              <p className="bg-background/60 p-2 text-center text-xs">{hex}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Gradient builder" actions={<CopyButton value={gradientCss} label="Copy CSS" />}>
        <div
          className="h-40 rounded-xl border border-border"
          style={{ backgroundImage: `linear-gradient(${angle}deg, ${color}, ${second})` }}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="grad-2">Second color</Label>
            <input
              id="grad-2"
              type="color"
              value={second}
              onChange={(e) => setSecond(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border border-border bg-transparent"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="grad-angle">Angle · {angle}°</Label>
            <Slider
              id="grad-angle"
              min={0}
              max={360}
              step={1}
              value={[angle]}
              onValueChange={([v]) => setAngle(v ?? 135)}
            />
          </div>
        </div>
        <code className="mt-4 block break-all rounded-lg bg-background/60 p-3 text-sm">
          {gradientCss}
        </code>
      </Panel>
    </div>
  );
}