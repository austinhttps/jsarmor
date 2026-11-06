import React from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import type { ObfuscatorConfig } from '../types/obfuscator';

interface AdvancedOptionsDrawerProps {
  config: ObfuscatorConfig;
  onChange: (updates: Partial<ObfuscatorConfig>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedOptionsDrawer: React.FC<AdvancedOptionsDrawerProps> = ({
  config,
  onChange,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 transition"
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Advanced AST & Obfuscation Knobs</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Compact */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.compact)}
              onChange={(e) => onChange({ compact: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Compact Code</span>
              <p className="text-[11px] text-slate-400">One-line minification</p>
            </div>
          </label>

          {/* Control Flow Flattening */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.controlFlowFlattening)}
              onChange={(e) => onChange({
                controlFlowFlattening: e.target.checked,
                controlFlowFlatteningThreshold: e.target.checked ? 0.75 : 0,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Control Flow Flattening</span>
              <p className="text-[11px] text-slate-400">Transforms loops/branches into switch state machines</p>
            </div>
          </label>

          {/* Dead Code Injection */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.deadCodeInjection)}
              onChange={(e) => onChange({
                deadCodeInjection: e.target.checked,
                deadCodeInjectionThreshold: e.target.checked ? 0.4 : 0,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Dead Code Injection</span>
              <p className="text-[11px] text-slate-400">Random dummy blocks to deceive static decompilers</p>
            </div>
          </label>

          {/* String Array */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.stringArray)}
              onChange={(e) => onChange({
                stringArray: e.target.checked,
                stringArrayThreshold: e.target.checked ? 0.8 : 0,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">String Array Extraction</span>
              <p className="text-[11px] text-slate-400">Pulls string literals into a hoisted array</p>
            </div>
          </label>

          {/* Numbers to Expressions */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.numbersToExpressions)}
              onChange={(e) => onChange({ numbersToExpressions: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Numbers to Expressions</span>
              <p className="text-[11px] text-slate-400">Converts numbers to binary math operations</p>
            </div>
          </label>

          {/* Transform Object Keys */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.transformObjectKeys)}
              onChange={(e) => onChange({ transformObjectKeys: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Transform Object Keys</span>
              <p className="text-[11px] text-slate-400">Turns obj.key into obj['key'] with string obfuscation</p>
            </div>
          </label>

          {/* Rename Globals */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.renameGlobals)}
              onChange={(e) => onChange({ renameGlobals: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Rename Globals</span>
              <p className="text-[11px] text-slate-400">Warning: May break browser globals if not configured</p>
            </div>
          </label>

          {/* Split Strings */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.splitStrings)}
              onChange={(e) => onChange({
                splitStrings: e.target.checked,
                splitStringsChunkLength: e.target.checked ? 5 : 10,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Split Strings</span>
              <p className="text-[11px] text-slate-400">Splits literal strings into small chunks concatenated</p>
            </div>
          </label>

          {/* Disable Console */}
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(config.disableConsoleOutput)}
              onChange={(e) => onChange({ disableConsoleOutput: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Silence Console Output</span>
              <p className="text-[11px] text-slate-400">Mutes console.log, info, error, and debug calls</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
