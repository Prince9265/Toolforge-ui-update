import type { ComponentType } from "react";
import {
  CaseConverter,
  DuplicateLineRemover,
  LoremIpsum,
  MarkdownEditor,
  TextDiff,
  WordCounter,
} from "./text";
import {
  Base64Tool,
  CodeMinifier,
  JsonFormatter,
  JwtDecoder,
  RegexTester,
  SqlFormatter,
} from "./developer";
import { ColorStudio, ImageCompressor, ImageResizer, SvgPngConverter } from "./image";
import {
  HashGenerator,
  OgMetaBuilder,
  PasswordGenerator,
  UrlEncoder,
  UuidGenerator,
} from "./security";
import {
  AgeCalculator,
  AspectRatioRem,
  PercentageCalculator,
  UnitConverter,
} from "./calculators";
import { ImagesToPdf, PdfMerger, PdfSplitter } from "./pdf";

export const toolComponents: Record<string, ComponentType> = {
  "markdown-editor": MarkdownEditor,
  "case-converter": CaseConverter,
  "word-counter": WordCounter,
  "duplicate-line-remover": DuplicateLineRemover,
  "text-diff": TextDiff,
  "lorem-ipsum": LoremIpsum,
  "json-formatter": JsonFormatter,
  "jwt-decoder": JwtDecoder,
  "sql-formatter": SqlFormatter,
  "regex-tester": RegexTester,
  base64: Base64Tool,
  "code-minifier": CodeMinifier,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "svg-png-converter": SvgPngConverter,
  "color-studio": ColorStudio,
  "password-generator": PasswordGenerator,
  "hash-generator": HashGenerator,
  "url-encoder": UrlEncoder,
  "og-meta-builder": OgMetaBuilder,
  "uuid-generator": UuidGenerator,
  "age-calculator": AgeCalculator,
  "aspect-ratio-rem": AspectRatioRem,
  "percentage-calculator": PercentageCalculator,
  "unit-converter": UnitConverter,
  "pdf-merge": PdfMerger,
  "pdf-split": PdfSplitter,
  "images-to-pdf": ImagesToPdf,
};