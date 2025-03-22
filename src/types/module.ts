import type { LazyLoadRuleConfiguration } from "./rules";

export interface LazyFile extends LazyLoadRuleConfiguration {
  /**
   * filepath (with name) of the specific file you want to load. This is relative to nuxt.options.rootDir
   */
  filePath: string;
  /**
   * If you want the resulting file to have a different name than the input file. This is relative to nuxt.options.rootDir
   */
  outputFilename?: string;
}

// ModuleOptions ensures that files are correctly typed based on the rule and includes the LazyLoadRuleConfiguration
export interface ModuleOptions extends LazyLoadRuleConfiguration {
  /**
   * What directory in your end build ("dist" by default) do you want the files to be in ?
   * This is the base directory, will be used so the plugin knows where the files that
   * need to be loaded are
   * @default "assets/css"
   */
  outputDir?: string;
  /**
   * Path to a directory to process all of the files in it. Works recursively
   * @default undefined
   */
  inputDir?: string;
  /**
   * Configuration of specific files you want to lazy load
   * @default undefined
   */
  files?: {
    css: LazyFile[];
  };
  /**
   * Whether or not you want the plugin enabled
   * @default true
   */
  plugin?: boolean;
  /**
   * Sets the log level from the module to verbose instead of the default, which is warn
   * @default undefined
   */
  verbose?: boolean;
}

export interface LazyLoadProcessedFiles {
  /**
   * Path + filename that lead to the file that was processed and is now in the dir specified
   * by outputDir
   * @see ModuleOptions
   * @default "assets/css"
   */
  path: string;
  /**
   * What rules are being applied to the file the path points to
   */
  rules: LazyLoadRuleConfiguration;
}
