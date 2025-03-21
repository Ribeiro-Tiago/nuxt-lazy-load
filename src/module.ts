import { resolve, dirname, extname, basename, join } from "node:path";
import { compile } from "sass";
import { defineNuxtModule, addPlugin, createResolver, resolvePath, useLogger } from "@nuxt/kit";
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";

import { name, version } from "../package.json";
import type { LazyFile, ModuleOptions, LazyLoadRuleConfiguration, LazyLoadProcessedFiles } from "./types/module";

// log level warning
const logger = useLogger(`nuxt:${name}`, { level: 1 });
const rootDir = `node_modules/.cache/${name}`;

const defaults: Required<Pick<ModuleOptions, "outputDir" | "plugin">> = {
  outputDir: "assets/css",
  plugin: true,
};

// remove OS shenannigans with folder dividers
const normalizePath = (path: string) => path.replaceAll(/[/\\]/g, "");

const getFilesToProcess = (specificFiles: LazyFile[], rules: LazyLoadRuleConfiguration, inputDir?: string) => {
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

export const configKey = "lazyLoadFiles";

export default defineNuxtModule<ModuleOptions>({
  meta: { name, version, configKey, compatibility: { nuxt: ">=3.0.0" } },
  defaults,
  async setup(options, nuxt) {
    const { plugin, files, outputDir, inputDir, verbose, ...rules } = options;
    if (verbose) {
      // it's the verbose log level from consola
      logger.level = Infinity;
    }

    logger.start(`Running ${name}...`);

    if ((!files || !files.css.length) && !rules) {
      logger.warn("No files or rules were defined. Stopping");
      return;
    }

    try {
      // ensure output dir exists
      const resolvedOutputDir = await resolvePath(resolve(rootDir, outputDir || defaults.outputDir));
      mkdirSync(resolvedOutputDir, { recursive: true });

      const processedFiles: LazyLoadProcessedFiles[] = [];

      getFilesToProcess(files?.css || [], rules, inputDir).forEach(({ filePath, outputFilename, ...rules }) => {
        const filename = outputFilename || `${basename(filePath, extname(filePath))}.css`;
        const outputPath = outputFilename
          ? // if user specified filename for end product, use it
            resolve(dirname(resolvedOutputDir), filename)
          : // if not, use the original filename
            resolve(resolvedOutputDir, filename);

        // compile to css
        const result = compile(resolve(nuxt.options.rootDir, filePath), { style: "compressed" });

        if (!result) {
          logger.error(`Failed to compile "${filePath}": "${JSON.stringify(result)}"`);
          return;
        }

        if (!result.css) {
          logger.warn(`"${filePath}" is empty, skipping file`);
          return;
        }

        logger.debug(`SCSS compiled successfully ${outputPath}`);

        // write compiled css to outputPath
        writeFileSync(outputPath, result.css);
        processedFiles.push({ path: join(outputDir || defaults.outputDir, filename), rules });

        logger.debug(`Compiled files stored in ${outputPath} assets direction`);
      });

      // Add file to public directory
      nuxt.options.nitro = nuxt.options.nitro || {};
      nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
      nuxt.options.nitro.publicAssets.push({ dir: resolvedOutputDir, baseURL: outputDir || defaults.outputDir });
      logger.debug("Styles added to public assets direction");

      // Register plugin
      if (plugin) {
        logger.debug("Registering plugin");

        nuxt.options.runtimeConfig.app = nuxt.options.runtimeConfig.app || {};
        nuxt.options.runtimeConfig.app[configKey] = processedFiles;

        addPlugin(
          {
            mode: "client",
            name: `${name}.client.ts`,
            src: createResolver(import.meta.url).resolve("./runtime/plugin"),
          },
          { append: true },
        );
      }

      logger.success(`${name} finished successfully`);
    } catch (err) {
      logger.error(err);
    }
  },
});

export * from "./types/module";
