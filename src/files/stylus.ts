import { readFileSync } from "node:fs";
import stylus from "stylus";

export const stylusProcessor = async (filePath: string) => {
  return stylus(readFileSync(filePath).toString()).set("compress", true).render();
};
