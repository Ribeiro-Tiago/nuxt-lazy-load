import type { useHead } from "#app";

type ValueOf<T> = T[keyof T];

// supported rules
export type LazyLoadRule = "windowWidthGreaterThan" | "windowWidthLessThan";

// rule specific configuration
export type LazyLoadRuleScreenSize = { width: number };

// rule to configuration mapper
export interface LazyLoadRuleConfigMap {
  windowWidthGreaterThan: LazyLoadRuleScreenSize;
  windowWidthLessThan: LazyLoadRuleScreenSize;
}

// RuleConfigurations maps each LazyLoadRule to its corresponding config
export type LazyLoadRuleConfiguration = {
  [key in LazyLoadRule]?: LazyLoadRuleConfigMap[key];
};

export type RuleFunctionReturn = Parameters<typeof useHead>[0];

export type RuleFunctionCallback = (payload: RuleFunctionReturn) => void;

export type RuleFunction<T = ValueOf<LazyLoadRuleConfigMap>> =
  | ((path: string, ruleConfig: T, callback: RuleFunctionCallback) => void)
  | ((path: string, ruleConfig: T) => RuleFunctionReturn);
