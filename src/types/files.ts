export type SupportedStyleType = "scss" | "sass" | "css" | "less";

export type StyleProcessorFunction = (filePath: string) => Promise<string | undefined | null>;
