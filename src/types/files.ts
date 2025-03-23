export type SupportedStyleType = "scss" | "sass";

export type StyleProcessorFunction = (filePath: string) => string | undefined | null;
