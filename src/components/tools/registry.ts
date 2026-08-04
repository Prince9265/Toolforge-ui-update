import type { ComponentType } from "react";
import { AiPromptEnhancer, AiTextHumanizer, SocialBioGenerator } from "./ai";
import { JsonFormatter, JwtDecoder, SqlFormatter, RegexDiff } from "./dev";
import { ImageCompressor, SvgToPng, PdfToolkit } from "./media";
import {
  MarkdownEditor,
  MetaTagGenerator,
  PasswordHashGenerator,
  WordCounter,
} from "./web";
import {
  AiPromptFormatter,
  CodeToImage,
  CronExplainer,
  GradientGlassGenerator,
  TextToSpeechReader,
} from "./studio";
import { legacyRegistry } from "@/legacy/registry";

export const toolRegistry: Record<string, ComponentType> = {
  ...legacyRegistry,
  "ai-prompt-enhancer": AiPromptEnhancer,
  "ai-text-humanizer": AiTextHumanizer,
  "social-bio-generator": SocialBioGenerator,
  "json-formatter": JsonFormatter,
  "jwt-decoder": JwtDecoder,
  "sql-formatter": SqlFormatter,
  "regex-diff": RegexDiff,
  "image-compressor": ImageCompressor,
  "svg-to-png": SvgToPng,
  "pdf-toolkit": PdfToolkit,
  "markdown-editor": MarkdownEditor,
  "meta-tag-generator": MetaTagGenerator,
  "password-hash-generator": PasswordHashGenerator,
  "word-counter": WordCounter,
  "code-to-image": CodeToImage,
  "cron-explainer": CronExplainer,
  "gradient-glass-generator": GradientGlassGenerator,
  "ai-prompt-formatter": AiPromptFormatter,
  "text-to-speech": TextToSpeechReader,
};
