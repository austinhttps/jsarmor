import { Shield, Sparkles, FolderArchive, Download, Play, Square, Lock } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  activeTab: 'playground' | 'batch';
  onTabChange: (tab: 'playground' | 'batch') => void;
  onOpenExport: () => void;
  onOpenSecurity: () => void;
  onRunSandbox: () => void;
  isProcessing: boolean;
  onObfuscate: () => void;
  onCancel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenExport,
  onOpenSecurity,
  onRunSandbox,
  isProcessing,
  onObfuscate,
  onCancel,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-500/20">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-slate-100 tracking-tight">JS Armor</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Zero-Trust Web
            </span>
          </div>
          <p className="text-xs text-slate-400">100% Client-Side In-Browser Obfuscation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onTabChange('playground')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'playground'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Playground</span>
        </button>
        <button
          onClick={() => onTabChange('batch')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeTab === 'batch'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Project / ZIP Batch</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSecurity}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Configure Domain Lock & Anti-Tamper"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Security & Lock</span>
        </button>

        <button
          onClick={onRunSandbox}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Test execute obfuscated script in sandbox"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" />
          <span>Test Run</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Export Config or CLI command"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Export / CLI</span>
        </button>

        {activeTab === 'playground' && (
          isProcessing ? (
            <button
              onClick={onCancel}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-900/30"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Cancel</span>
            </button>
          ) : (
            <button
              onClick={onObfuscate}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-lg shadow-cyan-900/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Obfuscate</span>
            </button>
          )
        )}
      </div>
    </header>
  );
};
