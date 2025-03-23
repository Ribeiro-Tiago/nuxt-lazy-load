import { readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { useLogger } from "@nuxt/kit";

import type { LazyFile, LazyLoadRuleConfiguration } from "../module";
import { sassProcessor } from "./sass";
import { cssProcessor } from "./css";
import { lessProcessor } from "./less";
import { logKey, logOptions } from "../config";
import type { StyleProcessorFunction, SupportedStyleType } from "../types/files";

// remove OS shenannigans with folder dividers
const normalizePath = (path: string) => path.replaceAll(/[/\\]/g, "");

const logger = useLogger(logKey, logOptions);

export const getFilesToProcess = (specificFiles: LazyFile[], rules: LazyLoadRuleConfiguration, inputDir?: string) => {
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
        logger.warn(
          `You manually included a file in "files" that also exist in the directory you defined with "inputDir". Skipping duplicate file ${path}`,
        );
      } else {
        files[normalizedPath] = { filePath: path, ...rules };
      }
    });
  }

  return Object.values(files);
};

const processorMapper: Record<SupportedStyleType, StyleProcessorFunction> = {
  scss: sassProcessor,
  sass: sassProcessor,
  css: cssProcessor,
  less: lessProcessor,
};

export const processFile = async (inputPath: string, outputPath: string) => {
  // get extension without .
  const ext = extname(inputPath).toLowerCase().substring(1) as SupportedStyleType;

  let css: Awaited<ReturnType<StyleProcessorFunction>>;
  const processor = processorMapper[ext];

  if (!processor) {
    logger.error(
      `Tried to process \`${inputPath}\` but type not supported. Received \`.${ext}\` but only supports one ${Object.keys(
        processorMapper,
      ).map((k) => `\`.${k}\``)}`,
    );
    return false;
  }

  try {
    css = await processor(inputPath);
  } catch (err: unknown) {
    logger.error(`Failed to process \`${inputPath}\`: ${err}`);
    return false;
  }

  if (!css) {
    logger.warn(`"${inputPath}" is empty, skipping file`);
    return false;
  }

  writeFileSync(outputPath, css);
  return true;
};
