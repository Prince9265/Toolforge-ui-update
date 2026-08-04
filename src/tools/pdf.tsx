import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel, ProcessingOverlay, downloadBlob, useProcessing } from "@/components/tool-ui";

export function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const { processing, run } = useProcessing(1500);

  const merge = () =>
    run(async () => {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      downloadBlob(new Blob([(await merged.save()).slice()], { type: "application/pdf" }), "merged.pdf");
    });

  return (
    <Panel title="Merge PDFs">
      <Label htmlFor="pdf-files">Select two or more PDFs (merged in the order chosen)</Label>
      <Input
        id="pdf-files"
        type="file"
        accept="application/pdf"
        multiple
        className="mt-2"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {files.map((f) => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
      <div className="mt-6">
        <Button onClick={merge} disabled={files.length < 2 || processing}>
          Merge & download
        </Button>
      </div>
      <ProcessingOverlay active={processing} label="Merging pages locally…" />
    </Panel>
  );
}

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const { processing, run } = useProcessing(1500);

  const split = () =>
    run(async () => {
      if (!file) return;
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const total = doc.getPageCount();
      const first = Math.max(1, Math.min(start, total));
      const last = Math.max(first, Math.min(end, total));
      const out = await PDFDocument.create();
      const indices = Array.from({ length: last - first + 1 }, (_, i) => first - 1 + i);
      const pages = await out.copyPages(doc, indices);
      pages.forEach((page) => out.addPage(page));
      downloadBlob(
        new Blob([(await out.save()).slice()], { type: "application/pdf" }),
        `pages-${first}-${last}.pdf`,
      );
    });

  return (
    <Panel title="Extract a page range">
      <Label htmlFor="pdf-split-file">PDF document</Label>
      <Input
        id="pdf-split-file"
        type="file"
        accept="application/pdf"
        className="mt-2"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pdf-start">First page</Label>
          <Input
            id="pdf-start"
            type="number"
            min={1}
            value={start}
            onChange={(e) => setStart(Number(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdf-end">Last page</Label>
          <Input
            id="pdf-end"
            type="number"
            min={1}
            value={end}
            onChange={(e) => setEnd(Number(e.target.value) || 1)}
          />
        </div>
      </div>
      <div className="mt-6">
        <Button onClick={split} disabled={!file || processing}>
          Extract & download
        </Button>
      </div>
      <ProcessingOverlay active={processing} />
    </Panel>
  );
}

export function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const { processing, run } = useProcessing(1500);

  const build = () =>
    run(async () => {
      const doc = await PDFDocument.create();
      for (const file of files) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const image = file.type.includes("png")
          ? await doc.embedPng(bytes)
          : await doc.embedJpg(bytes);
        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      downloadBlob(new Blob([(await doc.save()).slice()], { type: "application/pdf" }), "images.pdf");
    });

  return (
    <Panel title="Images to PDF">
      <Label htmlFor="img-pdf">Select JPG or PNG images</Label>
      <Input
        id="img-pdf"
        type="file"
        accept="image/png,image/jpeg"
        multiple
        className="mt-2"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />
      <p className="mt-3 text-sm text-muted-foreground">{files.length} image(s) selected</p>
      <div className="mt-6">
        <Button onClick={build} disabled={files.length === 0 || processing}>
          Build PDF
        </Button>
      </div>
      <ProcessingOverlay active={processing} />
    </Panel>
  );
}