import { resolve, dirname, extname, basename } from "node:path";
import { compile } from "sass";
import { defineNuxtModule, addPlugin, createResolver, resolvePath, useLogger } from "@nuxt/kit";
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";

// supported rules
export type LazyLoadRule = "widthGT" | "widthLT";

// rule specific configuration
export type LazyLoadRuleScreenSize = { width: number };

// rule to configuration mapper
interface RuleConfigMap {
  widthGT: LazyLoadRuleScreenSize;
  widthLT: LazyLoadRuleScreenSize;
  fooo: { bar: boolean };
}

// RuleConfigurations maps each LazyLoadRule to its corresponding config
type RuleConfigurations = {
  [key in LazyLoadRule]?: RuleConfigMap[key];
};

// LazyCSSFile ensures that the properties from RuleConfigMap[R] are included based on the rule
export interface LazyCSSFile extends RuleConfigurations {
  // relative to nuxt.options.rootDir
  filePath: string;
  // relative to nuxt.options.rootDir
  outputFilename?: string;
}

// ModuleOptions ensures that files are correctly typed based on the rule and includes the RuleConfigurations
export interface ModuleOptions extends RuleConfigurations {
  outputDir?: string;
  inputDir?: string;
  files?: LazyCSSFile[];
  plugin?: boolean;
}

const key = "lazy-load-css";
const logger = useLogger(`nuxt:${key}`);
const rootDir = `node_modules/.cache/${key}`;

const defaults: Required<Pick<ModuleOptions, "inputDir" | "outputDir" | "plugin">> = {
  inputDir: "app/assets/scss",
  outputDir: "assets/css",
  plugin: true,
};

const getFiles = (files?: LazyCSSFile[], rules?: RuleConfigurations, inputDir?: string) => {
  let allFiles: any[] = [];

  if (files) {
    allFiles = Array.isArray(files) ? files : [files];
  }

  if (rules) {
    // todo: add recursive search
    const filesInDir = readdirSync(inputDir || defaults.inputDir).filter((file) => {
      return [".scss", "sass"].includes(extname(file));
    });

    if (!filesInDir) {
      logger.warn(`No scss / sass files were found in input dir "${inputDir || defaults.inputDir}"`);
    }

    allFiles = [...allFiles, ...filesInDir];
  }
};

export default defineNuxtModule<ModuleOptions>({
  meta: { name: key, configKey: "lazyLoadCSS" },
  defaults,
  async setup(options, nuxt) {
    const { plugin, files, outputDir, inputDir, ...rules } = options;

    if (!files && !rules) {
      logger.warn("No files were defined. Stopping");
      return;
    }

    try {
      // const filesToProcess = getFiles(files, rules);

      // process files
      if (files) {
        // ensure output dir exists
        const resolvedOutputDir = await resolvePath(resolve(rootDir, outputDir || defaults.outputDir));

        mkdirSync(resolvedOutputDir, { recursive: true });

        files.forEach(({ filePath, outputFilename }) => {
          let outputPath = outputFilename
            ? // if user specified filename for end product, use it
              resolve(dirname(resolvedOutputDir), outputFilename)
            : // if not, use the original filename
              resolve(resolvedOutputDir, basename(filePath));

          // compile to css
          const result = compile(resolve(nuxt.options.rootDir, filePath), { style: "compressed" });
          logger.debug(`SCSS compiled successfully ${outputPath}`);

          // write compiled css to outputPath
          writeFileSync(outputPath, result.css);
          logger.debug(`Compiled files stored in ${outputPath} assets direction`);
        });
      }

      // process rules (global)

      // const resolvedOutputDir = await resolvePath(outputDir || defaults.outputDir);

      // filesToProcess.forEach(({ input, output }) => {
      //   // Ensure the output directory exists
      //   mkdirSync(resolve(resolvedOutputDir, dirname(output)), { recursive: true });

      //   // Compile the SCSS
      //   const outputPath = resolve(resolvedOutputDir, output);
      //   const result = compile(resolve(nuxt.options.rootDir, input), { style: "compressed" });
      //   logger.debug(`SCSS compiled successfully ${outputPath}`);

      //   // write compiled css to outputPath
      //   writeFileSync(outputPath, result.css);
      //   logger.debug(`Compiled files stored in ${outputPath} assets direction`);
      // });

      // Add file to public directory
      nuxt.options.nitro = nuxt.options.nitro || {};
      nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
      nuxt.options.nitro.publicAssets.push({ dir: outputDir });
      logger.debug("Styles added to public assets direction");

      // Register plugin
      if (options.plugin) {
        logger.debug("Registering plugin");
        addPlugin(
          {
            mode: "client",
            name: "lazyload-css.client.ts",
            src: createResolver(import.meta.url).resolve("./runtime/plugin"),
          },
          { append: true },
        );
      }

      logger.log("Compilation finished");
    } catch (err) {
      logger.error(err);
    }
  },
});
