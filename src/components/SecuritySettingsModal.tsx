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
    <div className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1119] border border-[#202737] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#1c2230] flex items-center justify-between bg-[#0b0d14]">
          <div className="flex items-center space-x-2 text-slate-100">
            <Lock className="w-4 h-4 text-slate-300" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Security & Environment Boundaries
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
          {/* Domain Lock */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <label className="font-semibold text-slate-200">Host Domain Boundary</label>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enforces origin gating. The script halts if launched from an unlisted host or port (one hostname per line).
            </p>
            <textarea
              rows={3}
              value={domainText}
              onChange={(e) => setDomainText(e.target.value)}
              placeholder="example.com&#10;app.internal.domain&#10;localhost:3000"
              className="w-full bg-[#08090f] border border-[#1d2331] rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-slate-500 transition"
            />
          </div>

          {/* Self Defending */}
          <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg bg-[#0a0c12] border border-[#1c2230] hover:border-[#2b3449] transition">
            <input
              type="checkbox"
              checked={security.selfDefending}
              onChange={(e) => onChange({ ...security, selfDefending: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-100 focus:ring-0"
            />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">Anti-Format / Self-Defending Trap</span>
              <p className="text-[11px] text-slate-400">
                Stalls execution via defensive recursion if the output script is reformatted or beautified.
              </p>
            </div>
          </label>

          {/* Debug Protection */}
          <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg bg-[#0a0c12] border border-[#1c2230] hover:border-[#2b3449] transition">
            <input
              type="checkbox"
              checked={security.debugProtection}
              onChange={(e) => onChange({ ...security, debugProtection: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-100 focus:ring-0"
            />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-200">DevTools Debug Protection</span>
              <p className="text-[11px] text-slate-400">
                Fires recursive debugger interrupts if the browser inspector is opened.
              </p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#1c2230] bg-[#0b0d14] flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-white text-slate-950 transition"
          >
            Save Boundaries
          </button>
        </div>
      </div>
    </div>
  );
};
