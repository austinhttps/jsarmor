import React from 'react';
import { Clock, HardDrive, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle } from 'lucide-react';
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
      <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl px-4 py-2.5 flex items-center space-x-2 text-rose-300 text-xs">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        <span className="font-semibold">Error:</span>
        <span className="font-mono truncate">{error}</span>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Transforming AST in Web Worker...</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Ready to protect code. Choose a preset or adjust options above.</span>
        <span className="text-[11px] text-slate-500 font-mono">Status: Idle</span>
      </div>
    );
  }

  const isLarger = metrics.byteDelta >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <span>Original:</span>
          <span className="font-mono font-medium text-slate-100">{formatBytes(metrics.originalBytes)}</span>
        </div>

        <div className="flex items-center space-x-2 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <span>Obfuscated:</span>
          <span className="font-mono font-medium text-slate-100">{formatBytes(metrics.obfuscatedBytes)}</span>
        </div>

        <div className="flex items-center space-x-1.5 font-mono">
          {isLarger ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className={isLarger ? 'text-amber-400' : 'text-emerald-400'}>
            {isLarger ? '+' : ''}{metrics.percentChange}% ({formatBytes(metrics.byteDelta)})
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{metrics.durationMs}ms</span>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px] font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Valid Syntax Verified</span>
      </div>
    </div>
  );
};
