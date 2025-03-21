import type { LazyLoadRuleScreenSize } from "../module";
import type { RuleFunction, RuleFunctionCallback } from "../types/rules";

// Helper function to handle resize logic
const handleResize = (path: string, callback: RuleFunctionCallback, condition: (innerWidth: number) => boolean) => {
  if (condition(window.innerWidth)) {
    callback({ link: [{ rel: "stylesheet", type: "text/css", href: path }] });
    return;
  }

  const update = (ev: Event) => {
    if (condition((ev.target as Window).innerWidth)) {
      callback({ link: [{ rel: "stylesheet", type: "text/css", href: path }] });

      window.removeEventListener("resize", update);
    }
  };

  window.addEventListener("resize", update, { passive: true });
};

// Refactored functions
export const screensizeLowerThan: RuleFunction<LazyLoadRuleScreenSize> = (path, { width }, callback) => {
  handleResize(path, callback!, (innerWidth) => innerWidth > width);
};

export const screensizeGreaterThan: RuleFunction<LazyLoadRuleScreenSize> = (path, { width }, callback) => {
  handleResize(path, callback!, (innerWidth) => innerWidth < width);
};
