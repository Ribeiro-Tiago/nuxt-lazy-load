import type { ConsolaOptions } from "consola";

import pkg from "../package.json";

export const name = pkg.name;
export const version = pkg.version;

export const logKey = `nuxt:${name}`;
export const logOptions: Partial<ConsolaOptions> = { level: 1 };
