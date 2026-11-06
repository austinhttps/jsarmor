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

    // Message handler to receive logs via postMessage across iframe boundary
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SANDBOX_CONSOLE') {
        const { level, args } = event.data;
        const formatted = `[${level}] ` + args.map((a: unknown) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        capturedLogs.push(formatted);
      }
    };

    window.addEventListener('message', onMessage);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');

    // Build self-contained HTML document for the sandboxed iframe
    const escapedCode = JSON.stringify(code);
    const htmlContent = `
      <!doctype html>
      <html>
        <head>
          <script>
            (function() {
              function send(level, args) {
                try {
                  window.parent.postMessage({
                    type: 'SANDBOX_CONSOLE',
                    level: level,
                    args: Array.from(args)
                  }, '*');
                } catch(e) {}
              }

              console.log = function() { send('LOG', arguments); };
              console.error = function() { send('ERR', arguments); };
              console.warn = function() { send('WARN', arguments); };
              console.info = function() { send('INFO', arguments); };

              try {
                eval(${escapedCode});
              } catch(err) {
                send('ERR', ['Runtime Error: ' + err.message]);
              }
            })();
          <\/script>
        </head>
        <body></body>
      </html>
    `;

    iframe.srcdoc = htmlContent;
    document.body.appendChild(iframe);

    // Allow script execution to complete
    setTimeout(() => {
      window.removeEventListener('message', onMessage);
      try {
        document.body.removeChild(iframe);
      } catch {}
      setLogs(capturedLogs.length > 0 ? capturedLogs : ['(Execution completed with 0 console output statements)']);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1119] border border-[#202737] rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#1c2230] flex items-center justify-between bg-[#0b0d14]">
          <div className="flex items-center space-x-2 text-slate-100">
            <Terminal className="w-4 h-4 text-slate-300" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Isolated Execution Sandbox
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Verifies that identifier mangling and string transformations didn't introduce runtime syntax
            or reference faults inside an isolated sandbox iframe.
          </p>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-200">Console Logs:</span>
            <button
              onClick={handleExecute}
              disabled={isRunning || !code}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-white disabled:opacity-40 text-slate-950 font-semibold transition"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run in Sandbox'}</span>
            </button>
          </div>

          <div className="p-3 bg-[#08090f] border border-[#1b202d] rounded-lg font-mono text-[11px] min-h-[160px] max-h-60 overflow-y-auto space-y-1">
            {executionError ? (
              <div className="text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Error: {executionError}</span>
              </div>
            ) : logs.length === 0 ? (
              <span className="text-slate-500 italic">Click "Run in Sandbox" to capture script runtime output.</span>
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
