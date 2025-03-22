type ValueOf<T> = T[keyof T];

/**
 * All supported rules
 */
export type LazyLoadRule = "windowWidthGreaterThan" | "windowWidthLessThan";

/**
 * Configuration for rules related to screen width
 */
export type LazyLoadRuleScreenSize = { width: number };

/**
 * Rule / Configuration configmap
 */
export interface LazyLoadRuleConfigMap {
  windowWidthGreaterThan: LazyLoadRuleScreenSize;
  windowWidthLessThan: LazyLoadRuleScreenSize;
}

// RuleConfigurations maps each LazyLoadRule to its corresponding config
export type LazyLoadRuleConfiguration = {
  /**
   * Rules to be applied to the specific file, or to all the files in a dir
   * @see ModuleOptions
   * @see LazyFile
   */
  [key in LazyLoadRule]?: LazyLoadRuleConfigMap[key];
};

// todo: type this correctly
export type RuleFunctionReturn = Record<string, any>;

export type RuleFunctionCallback = (payload: RuleFunctionReturn) => void;

export type RuleFunction<T = ValueOf<LazyLoadRuleConfigMap>> =
  | ((path: string, ruleConfig: T, callback: RuleFunctionCallback) => void)
  | ((path: string, ruleConfig: T) => RuleFunctionReturn);
