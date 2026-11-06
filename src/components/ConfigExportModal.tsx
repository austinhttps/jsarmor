import React, { useState } from 'react';
import { X, Copy, Download, Terminal, Check, Share2 } from 'lucide-react';
import type { ObfuscatorConfig, PresetTier } from '../types/obfuscator';
import { generateCliCommand, encodeStateToHash } from '../utils/urlState';

interface ConfigExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ObfuscatorConfig;
  inputCode: string;
  preset: PresetTier;
}

export const ConfigExportModal: React.FC<ConfigExportModalProps> = ({
  isOpen,
  onClose,
  config,
  inputCode,
  preset,
}) => {
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  if (!isOpen) return null;

  const jsonConfig = JSON.stringify(config, null, 2);
  const cliSnippet = generateCliCommand(config);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscator.config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliSnippet);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyShareUrl = () => {
    const hash = encodeStateToHash(inputCode, preset);
    const fullUrl = window.location.origin + window.location.pathname + hash;
    navigator.clipboard.writeText(fullUrl);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1119] border border-[#202737] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#1c2230] flex items-center justify-between bg-[#0b0d14]">
          <div className="flex items-center space-x-2 text-slate-100">
            <Terminal className="w-4 h-4 text-slate-300" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Export Configuration & CLI
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
        <div className="p-5 space-y-5 overflow-y-auto text-xs text-slate-300">
          {/* Shareable Link */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Shareable Playground Snapshot</span>
            </label>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Serializes current snippet and AST options directly into an immutable URL hash.
            </p>
            <button
              onClick={handleCopyShareUrl}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1c2233] border border-[#212738] text-slate-200 transition font-mono text-[11px]"
            >
              {copiedShareUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedShareUrl ? 'Snapshot URL Copied' : 'Copy Shareable Link'}</span>
            </button>
          </div>

          {/* JSON Config */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">
                JSON Options Spec (<code>obfuscator.config.json</code>)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1c2233] text-slate-300 border border-[#212738] transition font-mono text-[11px]"
                >
                  {copiedConfig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConfig ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1c2233] text-slate-300 border border-[#212738] transition font-mono text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-3 rounded-lg bg-[#08090f] border border-[#1b202d] text-[11px] font-mono text-slate-300 max-h-44 overflow-y-auto">
              {jsonConfig}
            </pre>
          </div>

          {/* CLI Command */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">
                Command Line Execution
              </label>
              <button
                onClick={handleCopyCli}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1c2233] text-slate-300 border border-[#212738] transition font-mono text-[11px]"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copied' : 'Copy CLI'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-[#08090f] border border-[#1b202d] text-[11px] font-mono text-slate-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
              {cliSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
