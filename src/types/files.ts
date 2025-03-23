export type SupportedStyleType = "scss" | "sass" | "css";

export type StyleProcessorFunction = (filePath: string) => Promise<string | undefined | null>;
