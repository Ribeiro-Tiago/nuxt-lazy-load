import less from "less";
import { readFileSync } from "node:fs";

export const lessProcessor = async (filePath: string) => {
  return (await less.render(readFileSync(filePath).toString(), { compress: true })).css;
};
