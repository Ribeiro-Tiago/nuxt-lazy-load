export type SupportedStyleType = "scss" | "sass" | "css";

export type StyleProcessorFunction = (filePath: string) => string | undefined | null;
