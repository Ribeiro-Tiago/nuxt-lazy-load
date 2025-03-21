import { resolve, dirname, extname, basename, join } from "node:path";
import { compile } from "sass";
import { writeFileSync } from "node:fs";

import type { LazyLoadProcessedFiles } from "../types/modules";
import type { Processor } from "../types/files";

export const processCss: Processor = (files, { resolvedOutputDir, nuxtRootDir, baseOutputDir }, logger) => {
  const processedFiles: LazyLoadProcessedFiles[] = [];

  files.forEach(({ filePath, outputFilename, ...rules }) => {
    const filename = outputFilename || `${basename(filePath, extname(filePath))}.css`;
    const outputPath = outputFilename
      ? // if user specified filename for end product, use it
        resolve(dirname(resolvedOutputDir), filename)
      : // if not, use the original filename
        resolve(resolvedOutputDir, filename);

    // compile to css
    const result = compile(resolve(nuxtRootDir, filePath), { style: "compressed" });

    if (!result) {
      logger.error(`Failed to compile "${filePath}": "${JSON.stringify(result)}"`);
      return;
    }

    if (!result.css) {
      logger.warn(`"${filePath}" is empty, skipping file`);
      return;
    }

    logger.debug(`SCSS compiled successfully ${outputPath}`);

    // write compiled css to outputPath
    writeFileSync(outputPath, result.css);
    processedFiles.push({ path: join(baseOutputDir, filename), rules });

    logger.debug(`Compiled files stored in ${outputPath} assets direction`);
  });

  return processedFiles;
};
