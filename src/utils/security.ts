import type { ObfuscatorConfig, SecurityOptions } from '../types/obfuscator';

export function parseDomainList(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('#'));
}

export function buildSecurityOverrides(security: SecurityOptions): Partial<ObfuscatorConfig> {
  const overrides: Partial<ObfuscatorConfig> = {
    selfDefending: security.selfDefending,
    debugProtection: security.debugProtection,
    debugProtectionInterval: security.debugProtectionInterval,
  };

  if (security.domainLock && security.domainLock.length > 0) {
    overrides.domainLock = security.domainLock;
    overrides.domainLockRedirectUrl = 'about:blank';
  } else {
    overrides.domainLock = [];
  }

  return overrides;
}
