import { resolve, join } from "node:path";
import { resolvePath } from "@nuxt/kit";
import { mkdirSync, readdirSync } from "node:fs";
import type { ConsolaInstance } from "consola";

import { processCss } from "./css";
import type {
  LazyLoadRuleConfiguration,
  LazyFile,
  ModuleOptions,
  DefaultModuleOptions,
  LazyLoadProcessedFiles,
  FileType,
} from "../types/modules";
import { name } from "../../package.json";
import type { Processor } from "../types/files";

const rootDir = `node_modules/.cache/${name}`;

export const defaults: DefaultModuleOptions = {
  outputDir: "assets",
  plugin: true,
};

// remove OS shenannigans with folder dividers
const normalizePath = (path: string) => path.replaceAll(/[/\\]/g, "");

const FileTypeMapper: Record<FileType, Processor> = {
  css: processCss,
};

class FileProcessor {
  private logger: ConsolaInstance;
  private nuxtRootDir: string;
  baseOutputDir: string = defaults.outputDir;
  resolvedOutputDir: string = "";

  constructor(logger: ConsolaInstance, nuxtRootDir: string) {
    this.logger = logger;
    this.nuxtRootDir = nuxtRootDir;
  }

  private async ensureOutputDir(outputDir?: string) {
    if (outputDir) {
      this.baseOutputDir = outputDir;
    }

    // ensure output dir exists
    const resolvedOutputDir = await resolvePath(resolve(rootDir, this.baseOutputDir));

    mkdirSync(resolvedOutputDir, { recursive: true });
    this.resolvedOutputDir = resolvedOutputDir;
  }

  async processFiles({ files, outputDir, inputDir, ...rules }: ModuleOptions) {
    if ((!files || Object.keys(files)) && !rules) {
      this.logger.warn("No files or path were defined. Stopping");
      return;
    }

    await this.ensureOutputDir(outputDir);

    return Object.entries(files!).reduce<LazyLoadProcessedFiles[]>((result, [type, value]) => {
      const processor = FileTypeMapper[type as FileType];

      if (!processor) {
        return result;
      }

      return result.concat(
        processor(
          this.getFilesToProcess(value, rules, inputDir),
          {
            resolvedOutputDir: this.resolvedOutputDir,
            nuxtRootDir: this.nuxtRootDir,
            baseOutputDir: this.baseOutputDir,
          },
          this.logger,
        ),
      );
    }, []);
  }

  getFilesToProcess(specificFiles: LazyFile[], rules: LazyLoadRuleConfiguration, inputDir?: string) {
    // if user only specified specific files, no need to do anything regarding dir search
    if (specificFiles.length && !inputDir) {
      return specificFiles;
    }

    // maps files to object where key is input path to be able to remove duplicates if user also has inputDir
    const files: Record<string, LazyFile> = specificFiles.reduce<Record<string, LazyFile>>((res, item) => {
      res[normalizePath(item.filePath)] = { ...rules, ...item };
      return res;
    }, {});

    if (inputDir) {
      readdirSync(inputDir, { withFileTypes: true, recursive: true }).forEach((file) => {
        const path = join(file.parentPath, file.name);
        const normalizedPath = normalizePath(path);

        if (file.isDirectory()) {
          return;
        }

        if (normalizedPath in files) {
          this.logger.warn(
            `You manually included a file in "files" that also exist in the directory you defined with "inputDir". Skipping duplicate file ${path}`,
          );
        } else {
          files[normalizedPath] = { filePath: path, ...rules };
        }
      });
    }

    return Object.values(files);
  }
}

export default FileProcessor;
