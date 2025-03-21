// supported rules
export type LazyLoadRule = "widthGT" | "widthLT";

// rule specific configuration
export type LazyLoadRuleScreenSize = { width: number };

// rule to configuration mapper
export interface LazyLoadRuleConfigMap {
  widthGT: LazyLoadRuleScreenSize;
  widthLT: LazyLoadRuleScreenSize;
}

// RuleConfigurations maps each LazyLoadRule to its corresponding config
export type LazyLoadRuleConfiguration = {
  [key in LazyLoadRule]?: LazyLoadRuleConfigMap[key];
};

export interface LazyFile extends LazyLoadRuleConfiguration {
  // relative to nuxt.options.rootDir
  filePath: string;
  // relative to nuxt.options.rootDir
  outputFilename?: string;
}

export type FileType = "css";

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

export type DefaultModuleOptions = Required<Pick<ModuleOptions, "outputDir" | "plugin">> &
  Omit<ModuleOptions, "outputDir" | "plugin">;

export interface LazyLoadProcessedFiles {
  path: string;
  rules: LazyLoadRuleConfiguration;
}
