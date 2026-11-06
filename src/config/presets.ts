import type { ObfuscatorConfig, PresetTier, SecurityOptions } from '../types/obfuscator';

export const PRESETS: Record<PresetTier, ObfuscatorConfig> = {
  light: {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: false,
    stringArray: false,
    stringArrayCallsTransform: false,
    stringArrayEncoding: [],
    stringArrayIndexShift: false,
    stringArrayRotate: false,
    stringArrayShuffle: false,
    stringArrayWrappersCount: 0,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0,
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
  },
  balanced: {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  },
  stealth: {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['rc4', 'base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 1,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  },
};

export function getEffectiveConfig(
  preset: PresetTier,
  security: Partial<SecurityOptions> = {},
  overrides: Partial<ObfuscatorConfig> = {}
): ObfuscatorConfig {
  const base = { ...PRESETS[preset] };

  const securityApplied: Partial<ObfuscatorConfig> = {};
  if (security.domainLock && security.domainLock.length > 0) {
    securityApplied.domainLock = security.domainLock;
    securityApplied.domainLockRedirectUrl = 'about:blank';
  }
  if (typeof security.selfDefending === 'boolean') {
    securityApplied.selfDefending = security.selfDefending;
  }
  if (typeof security.debugProtection === 'boolean') {
    securityApplied.debugProtection = security.debugProtection;
  }
  if (security.debugProtectionInterval !== undefined) {
    securityApplied.debugProtectionInterval = security.debugProtectionInterval;
  }

  return {
    ...base,
    ...securityApplied,
    ...overrides,
  };
}
