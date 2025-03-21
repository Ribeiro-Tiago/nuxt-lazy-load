import { LogLevels } from "consola";
import { defineNuxtModule, addPlugin, createResolver, useLogger } from "@nuxt/kit";

import type { ModuleOptions } from "./types/modules";
import { name, version } from "../package.json";
import FileProcessor, { defaults } from "./files";

// default log level
const logger = useLogger(`nuxt:${name}`, { level: 0 });

export const configKey = "lazyLoadFiles";

export default defineNuxtModule<ModuleOptions>({
  meta: { name, version, configKey, compatibility: { nuxt: ">=3.0.0" } },
  defaults,
  async setup(options, nuxt) {
    if (options.verbose) {
      logger.level = LogLevels.verbose;
    }

    logger.start(`Running ${name}...`);

    try {
      const processor = new FileProcessor(logger, nuxt.options.rootDir);
      const processedFiles = processor.processFiles(options);

      // Add file to public directory
      nuxt.options.nitro = nuxt.options.nitro || {};
      nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
      nuxt.options.nitro.publicAssets.push({
        dir: processor.resolvedOutputDir,
        baseURL: processor.baseOutputDir,
      });

      logger.debug("Styles added to public assets direction");

      // Register plugin
      if (options.plugin) {
        logger.debug("Registering plugin");

        nuxt.options.runtimeConfig.app = nuxt.options.runtimeConfig.app || {};
        nuxt.options.runtimeConfig.app.lazyLoadFiles = processedFiles;

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

// export all typings so they're available to people that use this module
export * from "./types/modules";
export * from "./types/files";
