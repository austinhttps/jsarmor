import { describe, it, expect } from 'vitest';
import { executeObfuscationSync } from '../workers/workerBridge';
import { PRESETS } from '../config/presets';

describe('Worker Bridge & Obfuscation Engine Execution', () => {
  it('successfully obfuscates valid JavaScript code synchronously or via bridge logic', () => {
    const input = 'function testFn() { const secretValue = "Secret Hello"; return secretValue; }';
    const result = executeObfuscationSync(input, PRESETS.light);

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.code).not.toContain('secretValue');
    expect(result.metrics).toBeDefined();
    expect(result.metrics?.originalBytes).toBe(input.length);
    expect(result.metrics?.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('captures syntax errors cleanly without throwing unhandled exceptions', () => {
    const brokenInput = 'function brokenSyntax( { return;';
    const result = executeObfuscationSync(brokenInput, PRESETS.balanced);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/Unexpected|error|token/i);
  });

  it('handles empty code input gracefully', () => {
    const result = executeObfuscationSync('', PRESETS.light);
    expect(result.success).toBe(true);
    expect(result.code).toBe('');
    expect(result.metrics?.originalBytes).toBe(0);
  });
});
