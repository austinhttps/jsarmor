import React, { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { Copy, Download, Columns, Check, RefreshCw } from 'lucide-react';
import { SAMPLE_CODES } from '../config/sampleCodes';

interface EditorPlaygroundProps {
  inputCode: string;
  onInputChange: (code: string) => void;
  outputCode: string;
  isProcessing: boolean;
  onSampleSelect: (sampleKey: keyof typeof SAMPLE_CODES) => void;
}

export const EditorPlayground: React.FC<EditorPlaygroundProps> = ({
  inputCode,
  onInputChange,
  outputCode,
  isProcessing,
  onSampleSelect,
}) => {
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputCode) return;
    const blob = new Blob([outputCode], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const monacoCommonOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontFamily: 'JetBrains Mono, SF Mono, Menlo, monospace',
    fontLigatures: true,
    theme: 'vs-dark',
  };

  return (
    <div className="flex flex-col flex-1 min-h-[500px] border border-[#1d222e] rounded-xl overflow-hidden bg-[#0d0f17] shadow-xl">
      {/* Top Toolbar */}
      <div className="border-b border-[#1d222e] bg-[#0a0c12] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-medium">Snippets:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onSampleSelect('basic')}
              className="px-2.5 py-1 rounded bg-[#131722] hover:bg-[#1a2030] text-slate-300 border border-[#212738] transition font-mono text-[11px]"
            >
              Auth Basic
            </button>
            <button
              onClick={() => onSampleSelect('apiClient')}
              className="px-2.5 py-1 rounded bg-[#131722] hover:bg-[#1a2030] text-slate-300 border border-[#212738] transition font-mono text-[11px]"
            >
              API Client
            </button>
            <button
              onClick={() => onSampleSelect('algorithm')}
              className="px-2.5 py-1 rounded bg-[#131722] hover:bg-[#1a2030] text-slate-300 border border-[#212738] transition font-mono text-[11px]"
            >
              Proof-of-Work
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border transition text-xs font-medium ${
              showDiff
                ? 'bg-[#1b2233] border-[#313c54] text-slate-100'
                : 'bg-[#131722] border-[#212738] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{showDiff ? 'Dual View' : 'Diff Inspector'}</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!outputCode}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131722] border border-[#212738] text-slate-300 hover:bg-[#1b2233] disabled:opacity-40 transition text-xs font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!outputCode}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131722] border border-[#212738] text-slate-300 hover:bg-[#1b2233] disabled:opacity-40 transition text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .js</span>
          </button>
        </div>
      </div>

      {/* Editors Area */}
      <div className="flex-1 min-h-[450px]">
        {showDiff ? (
          <DiffEditor
            original={inputCode}
            modified={outputCode || '// Output will appear here'}
            language="javascript"
            theme="vs-dark"
            options={{
              ...monacoCommonOptions,
              readOnly: true,
              renderSideBySide: true,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-[#1d222e]">
            {/* Input Editor */}
            <div className="flex flex-col h-full">
              <div className="bg-[#0b0d14] px-3.5 py-1.5 border-b border-[#1d222e] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>source.js (Editable)</span>
                <span className="text-slate-500 text-[10px]">UTF-8</span>
              </div>
              <div className="flex-1 min-h-[420px]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={inputCode}
                  onChange={(val) => onInputChange(val || '')}
                  theme="vs-dark"
                  options={monacoCommonOptions}
                />
              </div>
            </div>

            {/* Output Editor */}
            <div className="flex flex-col h-full relative">
              <div className="bg-[#0b0d14] px-3.5 py-1.5 border-b border-[#1d222e] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>protected.js (Obfuscated)</span>
                <span className="text-slate-500 text-[10px]">Read-only</span>
              </div>
              <div className="flex-1 min-h-[420px]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={outputCode}
                  theme="vs-dark"
                  options={{
                    ...monacoCommonOptions,
                    readOnly: true,
                  }}
                />
              </div>

              {isProcessing && (
                <div className="absolute inset-0 bg-[#090b10]/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-10">
                  <RefreshCw className="w-6 h-6 text-slate-200 animate-spin" />
                  <p className="text-xs font-medium text-slate-300 font-mono">Restructuring AST...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
