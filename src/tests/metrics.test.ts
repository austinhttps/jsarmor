import { describe, it, expect } from 'vitest';
import { calculateMetrics, formatBytes } from '../utils/metrics';

describe('Metrics Utilities', () => {
  it('formats byte units into human readable strings', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
  });

  it('accurately calculates metric deltas and percentage changes', () => {
    const original = 'const a = 1;';
    const obfuscated = 'const _0x12a=0x1;var dummy="bloat";';
    const metrics = calculateMetrics(original, obfuscated, 42);

    expect(metrics.durationMs).toBe(42);
    expect(metrics.originalBytes).toBe(original.length);
    expect(metrics.obfuscatedBytes).toBe(obfuscated.length);
    expect(metrics.byteDelta).toBe(obfuscated.length - original.length);
    expect(metrics.percentChange).toBeGreaterThan(0);
  });
});
