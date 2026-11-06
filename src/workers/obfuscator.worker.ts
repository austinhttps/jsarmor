import JavaScriptObfuscator from 'javascript-obfuscator';
import type { ObfuscatorConfig, ObfuscationResult } from '../types/obfuscator';

export interface WorkerInMessage {
  id: string;
  code: string;
  options: ObfuscatorConfig;
}

export interface WorkerOutMessage {
  id: string;
  result: ObfuscationResult;
}

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  const { id, code, options } = event.data;
  const startTime = performance.now();

  try {
    if (!code || code.trim() === '') {
      self.postMessage({
        id,
        result: {
          success: true,
          code: '',
          metrics: {
            originalBytes: 0,
            obfuscatedBytes: 0,
            byteDelta: 0,
            percentChange: 0,
            durationMs: 0,
          },
        },
      } as WorkerOutMessage);
      return;
    }

    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options);
    const obfuscatedCode = obfuscationResult.getObfuscatedCode();
    const durationMs = Math.round(performance.now() - startTime);

    const originalBytes = new TextEncoder().encode(code).length;
    const obfuscatedBytes = new TextEncoder().encode(obfuscatedCode).length;
    const byteDelta = obfuscatedBytes - originalBytes;
    const percentChange = originalBytes > 0 ? Math.round((byteDelta / originalBytes) * 100) : 0;

    self.postMessage({
      id,
      result: {
        success: true,
        code: obfuscatedCode,
        metrics: {
          originalBytes,
          obfuscatedBytes,
          byteDelta,
          percentChange,
          durationMs,
        },
      },
    } as WorkerOutMessage);
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : String(err);
    self.postMessage({
      id,
      result: {
        success: false,
        error: errorMessage,
        metrics: {
          originalBytes: new TextEncoder().encode(code).length,
          obfuscatedBytes: 0,
          byteDelta: 0,
          percentChange: 0,
          durationMs,
        },
      },
    } as WorkerOutMessage);
  }
};
