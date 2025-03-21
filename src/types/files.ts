import type { LazyFile, LazyLoadProcessedFiles } from "./modules";
import type { ConsolaInstance } from "consola";

interface Dirs {
  resolvedOutputDir: string;
  nuxtRootDir: string;
  baseOutputDir: string;
}

export type Processor = (
  files: LazyFile[],
  { resolvedOutputDir, nuxtRootDir, baseOutputDir }: Dirs,
  logger: ConsolaInstance,
) => LazyLoadProcessedFiles[];
