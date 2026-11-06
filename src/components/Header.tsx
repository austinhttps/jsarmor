import React from 'react';
import { Shield, Sparkles, FolderArchive, ArrowUpRight, Play, Square, Lock, Terminal } from 'lucide-react';

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
    <header className="border-b border-[#1f2430] bg-[#0d0f17]/90 backdrop-blur-md px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Brand & Purpose */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#1e2538] to-[#121622] border border-[#2d374d] flex items-center justify-center text-slate-100 shadow-sm">
          <Shield className="w-4 h-4 text-slate-200 stroke-[2.2]" />
        </div>
        <div className="flex items-center space-x-2.5">
          <span className="font-semibold text-sm text-slate-100 tracking-tight font-sans">
            JS Armor
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#171c28] text-slate-400 border border-[#272f42]">
            Local Sandbox
          </span>
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center bg-[#131620] p-1 rounded-lg border border-[#1f2533]">
        <button
          onClick={() => onTabChange('playground')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'playground'
              ? 'bg-[#22293b] text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 opacity-80" />
          <span>Playground</span>
        </button>
        <button
          onClick={() => onTabChange('batch')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'batch'
              ? 'bg-[#22293b] text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderArchive className="w-3.5 h-3.5 opacity-80" />
          <span>ZIP Batch</span>
        </button>
      </div>

      {/* Precision Action Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSecurity}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#141824] hover:bg-[#1c2233] text-slate-300 border border-[#232a3d] transition"
        >
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Security Rules</span>
        </button>

        <button
          onClick={onRunSandbox}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#141824] hover:bg-[#1c2233] text-slate-300 border border-[#232a3d] transition"
        >
          <Play className="w-3.5 h-3.5 text-slate-400" />
          <span>Sandbox Test</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#141824] hover:bg-[#1c2233] text-slate-300 border border-[#232a3d] transition"
        >
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CLI</span>
        </button>

        <div className="h-4 w-px bg-[#232a3d] mx-1" />

        {activeTab === 'playground' && (
          isProcessing ? (
            <button
              onClick={onCancel}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Cancel</span>
            </button>
          ) : (
            <button
              onClick={onObfuscate}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-white text-slate-950 transition shadow-sm"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Obfuscate</span>
            </button>
          )
        )}
      </div>
    </header>
  );
};
