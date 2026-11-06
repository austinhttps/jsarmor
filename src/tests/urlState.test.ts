import { describe, it, expect } from 'vitest';
import { encodeStateToHash, decodeStateFromHash, generateCliCommand } from '../utils/urlState';
import { PRESETS } from '../config/presets';

describe('URL State Sharing & CLI Exporter', () => {
  it('encodes and decodes state to and from URL hash', () => {
    const originalCode = 'const token = "abc-123";';
    const preset = 'stealth';
    const hash = encodeStateToHash(originalCode, preset);

    expect(hash).toBeDefined();
    expect(hash.length).toBeGreaterThan(0);

    const decoded = decodeStateFromHash(hash);
    expect(decoded).not.toBeNull();
    expect(decoded?.code).toBe(originalCode);
    expect(decoded?.preset).toBe(preset);
  });

  it('handles invalid or corrupted URL hash safely without throwing', () => {
    const decoded = decodeStateFromHash('corrupted-non-base64-$$$');
    expect(decoded).toBeNull();
  });

  it('generates accurate CLI commands based on configuration', () => {
    const cli = generateCliCommand(PRESETS.balanced);
    expect(cli).toContain('javascript-obfuscator input.js');
    expect(cli).toContain('--config obfuscator.config.json');
  });
});
