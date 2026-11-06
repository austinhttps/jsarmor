import React, { useState } from 'react';
import { X, Play, AlertCircle, Terminal } from 'lucide-react';

interface SandboxRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const SandboxRunnerModal: React.FC<SandboxRunnerModalProps> = ({
  isOpen,
  onClose,
  code,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecute = () => {
    setLogs([]);
    setExecutionError(null);
    setIsRunning(true);

    const capturedLogs: string[] = [];

    // Create an isolated sandboxed iframe to capture console logs without polluting host
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');
    document.body.appendChild(iframe);

    const iframeWin = iframe.contentWindow;
    if (!iframeWin) {
      setExecutionError('Could not construct isolated sandbox context.');
      setIsRunning(false);
      return;
    }

    try {
      // Hook console
      const customConsole = {
        log: (...args: any[]) => {
          capturedLogs.push('[LOG] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        error: (...args: any[]) => {
          capturedLogs.push('[ERR] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        warn: (...args: any[]) => {
          capturedLogs.push('[WARN] ' + args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
      };

      // Wrap code in self-executing container with custom console
      const runScript = `
        (function(console) {
          try {
            ${code}
          } catch(e) {
            console.error("Runtime exception:", e.message);
          }
        })(parentConsole);
      `;

      // @ts-expect-error Parent communication bridge
      iframeWin.parentConsole = customConsole;
      (iframeWin as unknown as { eval: (s: string) => void }).eval(runScript);

      setLogs(capturedLogs.length > 0 ? capturedLogs : ['(Execution completed with 0 console output statements)']);
    } catch (err: unknown) {
      setExecutionError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
      document.body.removeChild(iframe);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-100">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold">Isolated Sandbox Execution Test</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          <p className="text-[11px] text-slate-400">
            Executes the obfuscated script in an isolated sandboxed iframe to verify that syntax,
            identifier scoping, and string encoding didn't cause runtime syntax or reference errors.
          </p>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-200">Sandbox Console Output:</span>
            <button
              onClick={handleExecute}
              disabled={isRunning || !code}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold shadow transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running...' : 'Run in Sandbox'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] min-h-[160px] max-h-60 overflow-y-auto space-y-1">
            {executionError ? (
              <div className="text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Sandbox Error: {executionError}</span>
              </div>
            ) : logs.length === 0 ? (
              <span className="text-slate-500 italic">Click "Run in Sandbox" to execute the obfuscated script and view captured output.</span>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={log.startsWith('[ERR]') ? 'text-rose-400' : log.startsWith('[WARN]') ? 'text-amber-400' : 'text-slate-300'}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
