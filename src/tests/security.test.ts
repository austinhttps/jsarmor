import { describe, it, expect } from 'vitest';
import { parseDomainList, buildSecurityOverrides } from '../utils/security';

describe('Security Utilities', () => {
  it('parses and sanitizes comma or newline separated domain lists', () => {
    const raw = 'example.com, test.org \n localhost:3000\n  sub.domain.co  ,';
    const domains = parseDomainList(raw);

    expect(domains).toEqual(['example.com', 'test.org', 'localhost:3000', 'sub.domain.co']);
  });

  it('filters empty domain lists and rejects malformed strings', () => {
    expect(parseDomainList('')).toEqual([]);
    expect(parseDomainList('   ')).toEqual([]);
  });

  it('builds security overrides object matching javascript-obfuscator spec', () => {
    const sec = buildSecurityOverrides({
      domainLock: ['app.myproduct.com'],
      selfDefending: true,
      debugProtection: true,
      debugProtectionInterval: 2000,
    });

    expect(sec.domainLock).toEqual(['app.myproduct.com']);
    expect(sec.domainLockRedirectUrl).toBe('about:blank');
    expect(sec.selfDefending).toBe(true);
    expect(sec.debugProtection).toBe(true);
    expect(sec.debugProtectionInterval).toBe(2000);
  });
});
