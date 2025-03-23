import { render } from "less";
import { readFileSync } from "node:fs";

export const lessProcessor = async (filePath: string) => {
  return (await render(readFileSync(filePath).toString(), { compress: true })).css;
};
