import { resolve, dirname, extname, basename, join } from "node:path";
import { defineNuxtModule, addPlugin, createResolver, resolvePath, useLogger } from "@nuxt/kit";
import { mkdirSync } from "node:fs";

import { configKey } from "./runtime/config";
import type { ModuleOptions, LazyLoadProcessedFiles } from "./types/module";
import { getFilesToProcess, processFile } from "./files";
import { logKey, logOptions, name, version } from "./config";

// log level warning
const logger = useLogger(logKey, logOptions);
const rootDir = `node_modules/.cache/${name}`;

const defaults: Required<Pick<ModuleOptions, "outputDir" | "plugin">> = {
  outputDir: "assets/css",
  plugin: true,
};

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

      getFilesToProcess(logger, files?.css || [], rules, inputDir).forEach(({ filePath, outputFilename, ...rules }) => {
        const filename = outputFilename || `${basename(filePath, extname(filePath))}.css`;
        const outputPath = outputFilename
          ? // if user specified filename for end product, use it
            resolve(dirname(resolvedOutputDir), filename)
          : // if not, use the original filename
            resolve(resolvedOutputDir, filename);

        processFile(filePath, outputPath);
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
export type { LazyLoadRule, LazyLoadRuleScreenSize, LazyLoadRuleConfiguration } from "./types/rules";
