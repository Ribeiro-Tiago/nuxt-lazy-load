import { readFileSync } from "node:fs";
import postcss from "postcss";
import cssnano from "cssnano";

export const cssProcessor = async (filePath: string) => {
  return (await postcss([cssnano]).process(readFileSync(filePath, "utf8"), { from: filePath })).css;
};
