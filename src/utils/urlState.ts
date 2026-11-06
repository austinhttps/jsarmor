import type { PresetTier, ObfuscatorConfig } from '../types/obfuscator';

export interface SharedState {
  code: string;
  preset: PresetTier;
}

export function encodeStateToHash(code: string, preset: PresetTier): string {
  try {
    const payload: SharedState = { code, preset };
    const jsonStr = JSON.stringify(payload);
    // Base64 encode UTF-8 string safely
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return '#' + base64;
  } catch (e) {
    console.error('Failed to encode state hash:', e);
    return '';
  }
}

export function decodeStateFromHash(hash: string): SharedState | null {
  try {
    const cleanHash = hash.replace(/^#/, '');
    if (!cleanHash) return null;
    const binaryStr = atob(cleanHash);
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(binaryStr, (ch: string) => {
        return '%' + ('00' + ch.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    const parsed = JSON.parse(jsonStr) as SharedState;
    if (typeof parsed.code === 'string' && parsed.preset) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function generateCliCommand(config: ObfuscatorConfig): string {
  const serialized = JSON.stringify(config, null, 2);
  return `# 1. Save this configuration as obfuscator.config.json:
/*
${serialized}
*/

# 2. Run javascript-obfuscator via npx:
npx --yes javascript-obfuscator input.js --output output.js --config obfuscator.config.json`;
}
