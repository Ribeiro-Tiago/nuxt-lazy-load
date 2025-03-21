import type { useHead } from "#app";
import type { LazyLoadRuleConfigMap } from "../module";

type ValueOf<T> = T[keyof T];

type RuleConfigs = ValueOf<LazyLoadRuleConfigMap>;

export type RuleFunctionReturn = Parameters<typeof useHead>[0];

export type RuleFunctionCallback = (payload: RuleFunctionReturn) => void;

export type RuleFunction<T = RuleConfigs> =
  | ((path: string, ruleConfig: T, callback: RuleFunctionCallback) => void)
  | ((path: string, ruleConfig: T) => RuleFunctionReturn);
