import { compile } from "sass";

export const sassProcessor = async (filePath: string) => compile(filePath, { style: "compressed" }).css;
