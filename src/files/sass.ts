import { compile } from "sass";

export const sassProcessor = (filePath: string) => compile(filePath, { style: "compressed" }).css;
