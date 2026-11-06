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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-100">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold">Export Config, CLI Command & URL Sharing</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300">
          {/* Shareable Link */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Shareable Playground URL</span>
            </label>
            <p className="text-[11px] text-slate-400">
              Encodes your current source code and preset choice into a shareable URL hash.
            </p>
            <button
              onClick={handleCopyShareUrl}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition"
            >
              {copiedShareUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedShareUrl ? 'Link Copied to Clipboard!' : 'Copy Shareable URL'}</span>
            </button>
          </div>

          {/* JSON Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">
                JSON Configuration (<code>obfuscator.config.json</code>)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  {copiedConfig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConfig ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-48 overflow-y-auto">
              {jsonConfig}
            </pre>
          </div>

          {/* CLI Command */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200">
                Node / CI Command Line
              </label>
              <button
                onClick={handleCopyCli}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCli ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {cliSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
