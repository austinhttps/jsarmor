import JSZip from 'jszip';
import type { ObfuscatorConfig } from '../types/obfuscator';
import { executeObfuscationSync } from '../workers/workerBridge';

export function isJavaScriptFile(filename: string): boolean {
  return /\.(js|mjs|cjs)$/i.test(filename);
}

export async function processZipArchive(
  zipBlob: Blob,
  config: ObfuscatorConfig,
  onProgress?: (current: number, total: number, currentFile: string) => void
): Promise<Blob> {
  const sourceZip = await JSZip.loadAsync(zipBlob);
  const targetZip = new JSZip();

  // Find all JS files to calculate total
  const jsFiles: string[] = [];
  sourceZip.forEach((relativePath, file) => {
    if (!file.dir && isJavaScriptFile(relativePath)) {
      jsFiles.push(relativePath);
    }
  });

  const totalJs = jsFiles.length;
  let processed = 0;

  for (const [relativePath, file] of Object.entries(sourceZip.files)) {
    if (file.dir) {
      targetZip.folder(relativePath);
      continue;
    }

    if (isJavaScriptFile(relativePath)) {
      const code = await file.async('text');
      onProgress?.(processed + 1, totalJs, relativePath);

      const result = executeObfuscationSync(code, config);
      if (result.success && result.code !== undefined) {
        targetZip.file(relativePath, result.code);
      } else {
        // Fallback: write original with comment error header
        targetZip.file(
          relativePath,
          `/* Obfuscation error: ${result.error} */\n${code}`
        );
      }
      processed++;
    } else {
      // Non-JS file: copy verbatim binary/text
      const fileData = await file.async('uint8array');
      targetZip.file(relativePath, fileData);
    }
  }

  return targetZip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
