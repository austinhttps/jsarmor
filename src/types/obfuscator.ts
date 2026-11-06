export type PresetTier = 'light' | 'balanced' | 'stealth';

export interface SecurityOptions {
  domainLock: string[];
  selfDefending: boolean;
  debugProtection: boolean;
  debugProtectionInterval: number;
}

export type ObfuscatorConfig = Record<string, any>;

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
