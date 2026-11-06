import type { MetricsData } from '../types/obfuscator';

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i];
}

export function calculateMetrics(
  originalCode: string,
  obfuscatedCode: string,
  durationMs: number
): MetricsData {
  const originalBytes = new TextEncoder().encode(originalCode).length;
  const obfuscatedBytes = new TextEncoder().encode(obfuscatedCode).length;
  const byteDelta = obfuscatedBytes - originalBytes;
  const percentChange = originalBytes > 0 ? Math.round((byteDelta / originalBytes) * 100) : 0;

  return {
    originalBytes,
    obfuscatedBytes,
    byteDelta,
    percentChange,
    durationMs,
  };
}
