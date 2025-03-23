export type SupportedStyleType = "scss" | "sass" | "css" | "less" | "styl" | "stylus";

export type StyleProcessorFunction = (filePath: string) => Promise<string | undefined | null>;
