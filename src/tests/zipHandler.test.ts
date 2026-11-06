import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { isJavaScriptFile, processZipArchive } from '../utils/zipHandler';
import { PRESETS } from '../config/presets';

describe('ZIP & Multi-File Archive Handler', () => {
  it('correctly identifies JavaScript source extensions', () => {
    expect(isJavaScriptFile('app.js')).toBe(true);
    expect(isJavaScriptFile('src/utils/math.mjs')).toBe(true);
    expect(isJavaScriptFile('dist/bundle.cjs')).toBe(true);
    expect(isJavaScriptFile('style.css')).toBe(false);
    expect(isJavaScriptFile('index.html')).toBe(false);
    expect(isJavaScriptFile('icon.png')).toBe(false);
  });

  it('obfuscates JS files inside zip while preserving non-JS assets and folder structure', async () => {
    const zip = new JSZip();
    zip.file('src/index.js', 'function add(a, b) { return a + b; }');
    zip.file('public/style.css', 'body { color: red; }');
    zip.file('README.md', '# Documentation');

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    let processedCount = 0;
    const resultZipBlob = await processZipArchive(
      zipBlob,
      PRESETS.light,
      (current) => {
        processedCount = current;
      }
    );

    expect(resultZipBlob).toBeDefined();
    expect(processedCount).toBe(1);

    const unpackedResult = await JSZip.loadAsync(resultZipBlob);
    
    // Check non-JS files preserved
    const cssContent = await unpackedResult.file('public/style.css')?.async('text');
    expect(cssContent).toBe('body { color: red; }');

    const mdContent = await unpackedResult.file('README.md')?.async('text');
    expect(mdContent).toBe('# Documentation');

    // Check JS file obfuscated
    const jsContent = await unpackedResult.file('src/index.js')?.async('text');
    expect(jsContent).toBeDefined();
    expect(jsContent).not.toContain('return a + b');
  });
});
