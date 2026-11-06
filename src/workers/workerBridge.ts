import JavaScriptObfuscator from 'javascript-obfuscator';
import type { ObfuscatorConfig, ObfuscationResult } from '../types/obfuscator';
import type { WorkerInMessage, WorkerOutMessage } from './obfuscator.worker';

// Direct synchronous runner for Node/Vitest test environment or fallback
export function executeObfuscationSync(code: string, options: ObfuscatorConfig): ObfuscationResult {
  const startTime = performance.now();
  try {
    if (!code || code.trim() === '') {
      return {
        success: true,
        code: '',
        metrics: {
          originalBytes: 0,
          obfuscatedBytes: 0,
          byteDelta: 0,
          percentChange: 0,
          durationMs: 0,
        },
      };
    }

    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options);
    const obfuscatedCode = obfuscationResult.getObfuscatedCode();
    const durationMs = Math.round(performance.now() - startTime);

    const originalBytes = new TextEncoder().encode(code).length;
    const obfuscatedBytes = new TextEncoder().encode(obfuscatedCode).length;
    const byteDelta = obfuscatedBytes - originalBytes;
    const percentChange = originalBytes > 0 ? Math.round((byteDelta / originalBytes) * 100) : 0;

    return {
      success: true,
      code: obfuscatedCode,
      metrics: {
        originalBytes,
        obfuscatedBytes,
        byteDelta,
        percentChange,
        durationMs,
      },
    };
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: errorMessage,
      metrics: {
        originalBytes: new TextEncoder().encode(code).length,
        obfuscatedBytes: 0,
        byteDelta: 0,
        percentChange: 0,
        durationMs,
      },
    };
  }
}

// Browser Worker bridge manager with cancellation and timeout
export class ObfuscatorWorkerClient {
  private worker: Worker | null = null;
  private pendingCallbacks: Map<string, {
    resolve: (res: ObfuscationResult) => void;
    reject: (err: Error) => void;
    timeoutId: number;
  }> = new Map();

  private initWorker() {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return null;
    }
    if (!this.worker) {
      this.worker = new Worker(
        new URL('./obfuscator.worker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
        const { id, result } = event.data;
        const pending = this.pendingCallbacks.get(id);
        if (pending) {
          clearTimeout(pending.timeoutId);
          this.pendingCallbacks.delete(id);
          pending.resolve(result);
        }
      };

      this.worker.onerror = (err) => {
        console.error('Obfuscator Worker Error:', err);
        for (const [id, callback] of this.pendingCallbacks.entries()) {
          clearTimeout(callback.timeoutId);
          callback.resolve({
            success: false,
            error: 'Worker runtime error: ' + (err.message || 'Worker terminated'),
          });
          this.pendingCallbacks.delete(id);
        }
      };
    }
    return this.worker;
  }

  public obfuscate(
    code: string,
    options: ObfuscatorConfig,
    timeoutMs = 30000
  ): Promise<ObfuscationResult> {
    const worker = this.initWorker();
    if (!worker) {
      // Fallback to sync execution in environments without native web workers
      return Promise.resolve(executeObfuscationSync(code, options));
    }

    const id = Math.random().toString(36).substring(2, 11);

    return new Promise<ObfuscationResult>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.terminate();
        this.pendingCallbacks.delete(id);
        resolve({
          success: false,
          error: `Obfuscation timed out after ${timeoutMs / 1000} seconds. Try reducing aggressive settings like Control Flow Flattening.`,
        });
      }, timeoutMs);

      this.pendingCallbacks.set(id, { resolve, reject, timeoutId });

      const message: WorkerInMessage = { id, code, options };
      worker.postMessage(message);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    for (const [, callback] of this.pendingCallbacks.entries()) {
      clearTimeout(callback.timeoutId);
      callback.resolve({
        success: false,
        error: 'Operation cancelled by user.',
      });
    }
    this.pendingCallbacks.clear();
  }
}

export const obfuscatorClient = new ObfuscatorWorkerClient();
