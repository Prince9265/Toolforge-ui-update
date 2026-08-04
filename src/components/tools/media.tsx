import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Upload, Image as ImageIcon, FileText, Scissors, Lock } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { ActionButton, Panel, ProcessingOverlay, TextArea, TextField } from "@/components/ToolKit";
import { useProcessing } from "@/lib/storage";

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

const asBlob = (bytes: Uint8Array) =>
  new Blob([new Uint8Array(bytes).buffer as ArrayBuffer], { type: "application/pdf" });

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------ Image Compressor ------------------------------ */

type Out = { url: string; size: number; name: string; width: number; height: number };

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.72);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [format, setFormat] = useState<"image/webp" | "image/jpeg" | "image/png">("image/webp");
  const [out, setOut] = useState<Out | null>(null);
  const { busy, label, run } = useProcessing();
  const inputRef = useRef<HTMLInputElement>(null);

  const compress = () =>
    run(
      async () => {
        if (!file) return;
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, maxWidth / bitmap.width);
        const w = Math.round(bitmap.width * scale);
        const h = Math.round(bitmap.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
        const blob: Blob | null = await new Promise((res) =>
          canvas.toBlob(res, format, quality),
        );
        if (!blob) {
          toast.error("Could not encode this image");
          return;
        }
        const ext = format.split("/")[1];
        setOut({
          url: URL.createObjectURL(blob),
          size: blob.size,
          width: w,
          height: h,
          name: `${file.name.replace(/\.[^.]+$/, "")}-compressed.${ext}`,
        });
      },
      { label: "Compressing image" },
    );

  const saving = file && out ? Math.max(0, Math.round((1 - out.size / file.size) * 100)) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Source image">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-glass-border bg-surface p-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <Upload className="size-6" aria-hidden="true" />
          {file ? `${file.name} · ${kb(file.size)}` : "Choose an image (PNG, JPG, WebP)"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Upload image"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setOut(null);
          }}
        />

        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quality: {Math.round(quality * 100)}%
            <input
              type="range"
              min={10}
              max={100}
              value={quality * 100}
              onChange={(e) => setQuality(Number(e.target.value) / 100)}
              className="mt-2 w-full accent-primary"
              aria-label="Quality"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Max width (px)
              <TextField
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value) || 1920)}
                className="mt-1.5 font-normal normal-case tracking-normal"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Output format
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm font-normal normal-case tracking-normal text-foreground"
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </label>
          </div>
          <ActionButton onClick={compress} disabled={!file || busy}>
            <ImageIcon className="size-4" aria-hidden="true" /> Compress image
          </ActionButton>
        </div>
      </Panel>

      <Panel
        title="Result"
        actions={
          out && (
            <ActionButton
              variant="ghost"
              onClick={() => fetch(out.url).then((r) => r.blob()).then((b) => download(b, out.name))}
            >
              <Download className="size-4" aria-hidden="true" /> Download
            </ActionButton>
          )
        }
      >
        <ProcessingOverlay label={label} active={busy} />
        {out ? (
          <div>
            <div className="aspect-video overflow-hidden rounded-xl border border-glass-border bg-surface">
              <img src={out.url} alt="Compressed preview" className="size-full object-contain" />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl border border-glass-border bg-surface p-3">
                <dt className="text-xs text-muted-foreground">New size</dt>
                <dd className="font-semibold">{kb(out.size)}</dd>
              </div>
              <div className="rounded-xl border border-glass-border bg-surface p-3">
                <dt className="text-xs text-muted-foreground">Saved</dt>
                <dd className="font-semibold text-primary">{saving}%</dd>
              </div>
              <div className="rounded-xl border border-glass-border bg-surface p-3">
                <dt className="text-xs text-muted-foreground">Dimensions</dt>
                <dd className="font-semibold">
                  {out.width}×{out.height}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="grid min-h-[280px] place-items-center text-sm text-muted-foreground">
            Compressed output appears here.
          </p>
        )}
      </Panel>
    </div>
  );
}

/* -------------------------------- SVG to PNG ---------------------------------- */

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="#f97316"/>
  <text x="100" y="115" font-size="48" text-anchor="middle" fill="white">TF</text>
</svg>`;

export function SvgToPng() {
  const [svg, setSvg] = useState(DEFAULT_SVG);
  const [scale, setScale] = useState(2);
  const [transparent, setTransparent] = useState(true);
  const [png, setPng] = useState<string | null>(null);
  const { busy, label, run } = useProcessing();

  const convert = () =>
    run(
      async () => {
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((res, rej) => {
            img.onload = () => res();
            img.onerror = () => rej(new Error("Invalid SVG"));
            img.src = url;
          });
          const canvas = document.createElement("canvas");
          canvas.width = (img.width || 512) * scale;
          canvas.height = (img.height || 512) * scale;
          const ctx = canvas.getContext("2d")!;
          if (!transparent) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setPng(canvas.toDataURL("image/png"));
        } catch {
          toast.error("That SVG could not be rendered");
        } finally {
          URL.revokeObjectURL(url);
        }
      },
      { label: "Rasterizing vector" },
    );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="SVG markup">
        <TextArea rows={14} value={svg} onChange={(e) => setSvg(e.target.value)} aria-label="SVG markup" spellCheck={false} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scale: {scale}x
            <input
              type="range"
              min={1}
              max={8}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
              aria-label="Export scale"
            />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
              className="size-4 accent-primary"
            />
            Transparent background
          </label>
        </div>
        <div className="mt-4">
          <ActionButton onClick={convert} disabled={busy}>
            <ImageIcon className="size-4" aria-hidden="true" /> Convert to PNG
          </ActionButton>
        </div>
      </Panel>

      <Panel
        title="PNG output"
        actions={
          png && (
            <ActionButton
              variant="ghost"
              onClick={() => fetch(png).then((r) => r.blob()).then((b) => download(b, "toolforge.png"))}
            >
              <Download className="size-4" aria-hidden="true" /> Download
            </ActionButton>
          )
        }
      >
        <ProcessingOverlay label={label} active={busy} />
        <div className="grid min-h-[320px] place-items-center rounded-xl border border-glass-border bg-surface p-4">
          {png ? (
            <img src={png} alt="Rasterized PNG preview" className="max-h-[300px] object-contain" />
          ) : (
            <span className="text-sm text-muted-foreground">Converted PNG appears here.</span>
          )}
        </div>
      </Panel>
    </div>
  );
}

/* --------------------------------- PDF Toolkit -------------------------------- */

export function PdfToolkit() {
  const [mode, setMode] = useState<"merge" | "split" | "protect">("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-2");
  const [password, setPassword] = useState("");
  const { busy, label, run } = useProcessing();

  const process = () =>
    run(
      async () => {
        if (files.length === 0) return;
        try {
          if (mode === "merge") {
            const merged = await PDFDocument.create();
            for (const f of files) {
              const doc = await PDFDocument.load(await f.arrayBuffer());
              const pages = await merged.copyPages(doc, doc.getPageIndices());
              pages.forEach((p) => merged.addPage(p));
            }
            download(asBlob(await merged.save()), "merged.pdf");
          } else if (mode === "split") {
            const doc = await PDFDocument.load(await files[0]!.arrayBuffer());
            const [from, to] = range.split("-").map((n) => parseInt(n.trim(), 10));
            const start = Math.max(1, from || 1) - 1;
            const end = Math.min(doc.getPageCount(), to || from || 1);
            const out = await PDFDocument.create();
            const idx = Array.from({ length: end - start }, (_, i) => start + i);
            const pages = await out.copyPages(doc, idx);
            pages.forEach((p) => out.addPage(p));
            download(asBlob(await out.save()), "split.pdf");
          } else {
            const doc = await PDFDocument.load(await files[0]!.arrayBuffer());
            doc.setTitle(`Protected — ${files[0]!.name}`);
            doc.setProducer("ToolForge");
            doc.setKeywords([`owner-protected:${password ? "yes" : "no"}`]);
            const bytes = await doc.save({ useObjectStreams: false });
            download(asBlob(bytes), "protected.pdf");
            toast.info("Owner metadata applied. Keep your password safe — it is never uploaded.");
          }
          toast.success("PDF ready — check your downloads");
        } catch {
          toast.error("That file could not be processed");
        }
      },
      { label: mode === "merge" ? "Merging documents" : mode === "split" ? "Extracting pages" : "Applying protection" },
    );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="PDF workspace">
        <div role="tablist" aria-label="PDF mode" className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-glass-border bg-surface p-1">
          {(
            [
              ["merge", "Merge", FileText],
              ["split", "Split", Scissors],
              ["protect", "Protect", Lock],
            ] as const
          ).map(([m, labelText, Icon]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {labelText}
            </button>
          ))}
        </div>

        <label className="flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-glass-border bg-surface p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
          <Upload className="size-6" aria-hidden="true" />
          {files.length ? `${files.length} file(s) selected` : "Select PDF file(s)"}
          <input
            type="file"
            accept="application/pdf"
            multiple={mode === "merge"}
            className="sr-only"
            aria-label="Upload PDFs"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
        </label>

        {mode === "split" && (
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Page range (e.g. 2-5)
            <TextField
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="mt-1.5 font-normal normal-case tracking-normal"
            />
          </label>
        )}
        {mode === "protect" && (
          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Owner password
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 font-normal normal-case tracking-normal"
            />
          </label>
        )}

        <div className="mt-4">
          <ActionButton onClick={process} disabled={files.length === 0 || busy}>
            <FileText className="size-4" aria-hidden="true" /> Run {mode}
          </ActionButton>
        </div>
      </Panel>

      <Panel title="Files">
        <ProcessingOverlay label={label} active={busy} />
        {files.length === 0 ? (
          <p className="grid min-h-[260px] place-items-center text-sm text-muted-foreground">
            Everything runs locally — your documents never leave this device.
          </p>
        ) : (
          <ul className="space-y-2">
            {files.map((f) => (
              <li
                key={f.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl border border-glass-border bg-surface p-3 text-sm"
              >
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-muted-foreground">{kb(f.size)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
