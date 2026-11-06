import React, { useState } from 'react';
import { X, Lock, Globe } from 'lucide-react';
import type { SecurityOptions } from '../types/obfuscator';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  security: SecurityOptions;
  onChange: (updated: SecurityOptions) => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  security,
  onChange,
}) => {
  const [domainText, setDomainText] = useState(security.domainLock.join('\n'));

  if (!isOpen) return null;

  const handleSave = () => {
    const domains = domainText
      .split(/[\n,]/)
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    onChange({
      ...security,
      domainLock: domains,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-100">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold">Security, Anti-Tamper & Domain Lock</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Domain Lock */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <label className="font-semibold text-slate-200">Domain Locking</label>
            </div>
            <p className="text-[11px] text-slate-400">
              Only allow execution on these hostnames or regexes (one per line or comma-separated).
              If opened elsewhere, the script redirects to <code>about:blank</code> or halts.
            </p>
            <textarea
              rows={3}
              value={domainText}
              onChange={(e) => setDomainText(e.target.value)}
              placeholder="example.com&#10;app.internal.domain&#10;localhost:3000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Self Defending */}
          <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <input
              type="checkbox"
              checked={security.selfDefending}
              onChange={(e) => onChange({ ...security, selfDefending: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
            />
            <div className="space-y-1">
              <span className="font-semibold text-slate-100 flex items-center space-x-1.5">
                <span>Self-Defending Anti-Format Check</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  Defensive
                </span>
              </span>
              <p className="text-[11px] text-slate-400">
                Guards code against beautification or tampering. If formatted or modified, an intentional infinite recursion will stall execution.
              </p>
            </div>
          </label>

          {/* Debug Protection */}
          <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <input
              type="checkbox"
              checked={security.debugProtection}
              onChange={(e) => onChange({ ...security, debugProtection: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-purple-500 focus:ring-0"
            />
            <div className="space-y-1">
              <span className="font-semibold text-slate-100 flex items-center space-x-1.5">
                <span>Debug Protection (DevTools Countermeasures)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800">
                  Aggressive
                </span>
              </span>
              <p className="text-[11px] text-slate-400">
                Freezes browser developer tools inspection by repeatedly firing <code>debugger;</code> traps when the console is opened.
              </p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-lg shadow-cyan-950"
          >
            Apply Security Options
          </button>
        </div>
      </div>
    </div>
  );
};
