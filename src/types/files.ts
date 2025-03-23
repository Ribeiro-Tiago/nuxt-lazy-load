export type SupportedStyleType = "scss" | "sass" | "css" | "styl" | "stylus";

export type StyleProcessorFunction = (filePath: string) => Promise<string | undefined | null>;
