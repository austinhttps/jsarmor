import type { ObfuscatorOptions } from 'javascript-obfuscator';

export type PresetTier = 'light' | 'balanced' | 'stealth';

export interface SecurityOptions {
  domainLock: string[];
  selfDefending: boolean;
  debugProtection: boolean;
  debugProtectionInterval: number | boolean;
}

export type ObfuscatorConfig = ObfuscatorOptions;

export interface MetricsData {
  originalBytes: number;
  obfuscatedBytes: number;
  byteDelta: number;
  percentChange: number;
  durationMs: number;
}

export interface ObfuscationResult {
  success: boolean;
  code?: string;
  error?: string;
  metrics?: MetricsData;
}
