import { readFileSync } from "node:fs";
import postcss from "postcss";
import cssnano from "cssnano";

export const cssProcessor = (filePath: string) => {
  return postcss([cssnano]).process(readFileSync(filePath, "utf8"), { from: filePath }).sync().css;
};
