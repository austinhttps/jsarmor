import React, { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { Copy, Download, Columns, FileCode, Check, RefreshCw } from 'lucide-react';
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
    fontFamily: 'Fira Code, Menlo, Monaco, Consolas, monospace',
    fontLigatures: true,
    theme: 'vs-dark',
  };

  return (
    <div className="flex flex-col flex-1 min-h-[500px] border border-slate-800 rounded-xl overflow-hidden bg-slate-900 shadow-xl">
      {/* Top Toolbar */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">Input Source:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onSampleSelect('basic')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
            >
              Auth Basic
            </button>
            <button
              onClick={() => onSampleSelect('apiClient')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
            >
              API Client
            </button>
            <button
              onClick={() => onSampleSelect('algorithm')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
            >
              Proof-of-Work
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border transition ${
              showDiff
                ? 'bg-cyan-950 border-cyan-800 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{showDiff ? 'Dual Editor' : 'Side-by-side Diff'}</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!outputCode}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!outputCode}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition"
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
          <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Input Editor */}
            <div className="flex flex-col h-full">
              <div className="bg-slate-950/80 px-3 py-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>original.js</span>
                </div>
                <span>Editable</span>
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
              <div className="bg-slate-950/80 px-3 py-1.5 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>obfuscated.js</span>
                </div>
                <span>Read-only</span>
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
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-10">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-xs font-semibold text-slate-200">Scrambling AST in Web Worker...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
