import { describe, it, expect } from 'vitest';
import { PRESETS, getEffectiveConfig } from '../config/presets';
import { SAMPLE_CODES } from '../config/sampleCodes';

describe('Presets and Configuration', () => {
  it('defines light, balanced, and stealth presets with correct characteristics', () => {
    expect(PRESETS.light).toBeDefined();
    expect(PRESETS.balanced).toBeDefined();
    expect(PRESETS.stealth).toBeDefined();

    expect(PRESETS.light.compact).toBe(true);
    expect(PRESETS.light.controlFlowFlattening).toBe(false);

    expect(PRESETS.balanced.compact).toBe(true);
    expect(PRESETS.balanced.stringArray).toBe(true);

    expect(PRESETS.stealth.controlFlowFlattening).toBe(true);
    expect(PRESETS.stealth.deadCodeInjection).toBe(true);
    expect(PRESETS.stealth.stringArray).toBe(true);
  });

  it('correctly merges preset options with security and advanced overrides', () => {
    const config = getEffectiveConfig('balanced', {
      domainLock: ['example.com'],
      selfDefending: true,
      debugProtection: true,
    }, {
      compact: false,
    });

    expect(config.domainLock).toEqual(['example.com']);
    expect(config.selfDefending).toBe(true);
    expect(config.debugProtection).toBe(true);
    expect(config.compact).toBe(false);
    expect(config.stringArray).toBe(true); // from balanced preset
  });

  it('provides varied sample codes', () => {
    expect(SAMPLE_CODES.basic).toBeDefined();
    expect(SAMPLE_CODES.apiClient).toBeDefined();
    expect(SAMPLE_CODES.algorithm).toBeDefined();
    expect(SAMPLE_CODES.basic.length).toBeGreaterThan(20);
  });
});
