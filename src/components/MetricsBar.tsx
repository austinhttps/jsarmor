import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { MetricsData } from '../types/obfuscator';
import { formatBytes } from '../utils/metrics';

interface MetricsBarProps {
  metrics?: MetricsData;
  error?: string;
  isProcessing: boolean;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, error, isProcessing }) => {
  if (error) {
    return (
      <div className="bg-[#1e1317] border border-rose-900/60 rounded-xl px-4 py-2.5 flex items-center space-x-2 text-rose-300 text-xs">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        <span className="font-semibold text-rose-200">Error:</span>
        <span className="font-mono truncate">{error}</span>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-[#0f121a] border border-[#1d222e] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
          <span className="font-medium text-slate-200">Processing AST in Isolated Web Worker...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-[#0f121a] border border-[#1d222e] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-slate-300">
          Ready to protect JavaScript source. Select a tier or edit AST options below.
        </span>
        <span className="text-[11px] font-mono text-slate-500">Status: Standby</span>
      </div>
    );
  }

  const isLarger = metrics.byteDelta >= 0;

  return (
    <div className="bg-[#0f121a] border border-[#1d222e] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center space-x-5 font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 uppercase text-[10px] tracking-wider">Input:</span>
          <span className="text-slate-200 font-semibold">{formatBytes(metrics.originalBytes)}</span>
        </div>

        <div className="h-3 w-px bg-[#202636]" />

        <div className="flex items-center space-x-2">
          <span className="text-slate-500 uppercase text-[10px] tracking-wider">Output:</span>
          <span className="text-slate-200 font-semibold">{formatBytes(metrics.obfuscatedBytes)}</span>
        </div>

        <div className="h-3 w-px bg-[#202636]" />

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500 uppercase text-[10px] tracking-wider">Delta:</span>
          <span className={`font-semibold ${isLarger ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isLarger ? '+' : ''}{metrics.percentChange}% ({formatBytes(metrics.byteDelta)})
          </span>
        </div>

        <div className="h-3 w-px bg-[#202636]" />

        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500 uppercase text-[10px] tracking-wider">Duration:</span>
          <span className="text-slate-300 font-semibold">{metrics.durationMs}ms</span>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Valid AST Syntax</span>
      </div>
    </div>
  );
};
