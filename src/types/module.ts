import type { LazyLoadRuleConfiguration } from "./rules";

export interface LazyFile extends LazyLoadRuleConfiguration {
  // relative to nuxt.options.rootDir
  filePath: string;
  // relative to nuxt.options.rootDir
  outputFilename?: string;
}

// ModuleOptions ensures that files are correctly typed based on the rule and includes the LazyLoadRuleConfiguration
export interface ModuleOptions extends LazyLoadRuleConfiguration {
  outputDir?: string;
  inputDir?: string;
  files?: {
    css: LazyFile[];
  };
  plugin?: boolean;
  verbose?: boolean;
}

export interface LazyLoadProcessedFiles {
  path: string;
  rules: LazyLoadRuleConfiguration;
}
