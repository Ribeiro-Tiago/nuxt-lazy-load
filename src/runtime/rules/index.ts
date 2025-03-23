import type { LazyLoadRule } from "../../module";
import type { RuleFunction } from "../../types/rules";
import { screensizeGreaterThan, screensizeLowerThan } from "./screensize";

const mapper: Record<LazyLoadRule, RuleFunction> = {
  windowWidthLessThan: screensizeLowerThan,
  windowWidthGreaterThan: screensizeGreaterThan,
};

export default mapper;
