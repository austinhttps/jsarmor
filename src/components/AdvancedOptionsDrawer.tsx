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
    <div className="border border-[#1d222e] rounded-xl bg-[#0d0f17] overflow-hidden transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white hover:bg-[#131722] transition"
      >
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Advanced AST Configuration</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-500 font-mono text-[11px]">
          <span>{isOpen ? 'Collapse' : 'Expand Options'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-[#1d222e] bg-[#0b0d14] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* Compact */}
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[#1b202c] hover:border-[#283042] bg-[#0f121a] transition">
            <input
              type="checkbox"
              checked={Boolean(config.compact)}
              onChange={(e) => onChange({ compact: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-200 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Compact Code</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Strip whitespace and collapse into a single line</p>
            </div>
          </label>

          {/* Control Flow Flattening */}
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[#1b202c] hover:border-[#283042] bg-[#0f121a] transition">
            <input
              type="checkbox"
              checked={Boolean(config.controlFlowFlattening)}
              onChange={(e) => onChange({
                controlFlowFlattening: e.target.checked,
                controlFlowFlatteningThreshold: e.target.checked ? 0.75 : 0,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-200 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Control Flow Flattening</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Transforms loops/branches into switch state machines</p>
            </div>
          </label>

          {/* Dead Code Injection */}
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[#1b202c] hover:border-[#283042] bg-[#0f121a] transition">
            <input
              type="checkbox"
              checked={Boolean(config.deadCodeInjection)}
              onChange={(e) => onChange({
                deadCodeInjection: e.target.checked,
                deadCodeInjectionThreshold: e.target.checked ? 0.4 : 0,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-200 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Dead Code Injection</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Injects unreachable blocks to fool static analysis</p>
            </div>
          </label>

          {/* String Array */}
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[#1b202c] hover:border-[#283042] bg-[#0f121a] transition">
            <input
              type="checkbox"
              checked={Boolean(config.stringArray)}
              onChange={(e) => onChange({
                stringArray: e.target.checked,
                stringArrayThreshold: e.target.checked ? 0.8 : 0,
              })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-200 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">String Array Extraction</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Hoists literal strings into a scrambled array</p>
            </div>
          </label>

          {/* Numbers to Expressions */}
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[#1b202c] hover:border-[#283042] bg-[#0f121a] transition">
            <input
              type="checkbox"
              checked={Boolean(config.numbersToExpressions)}
              onChange={(e) => onChange({ numbersToExpressions: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-200 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Numbers to Expressions</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Replaces numeric constants with computed bitwise expressions</p>
            </div>
          </label>

          {/* Transform Object Keys */}
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 rounded-lg border border-[#1b202c] hover:border-[#283042] bg-[#0f121a] transition">
            <input
              type="checkbox"
              checked={Boolean(config.transformObjectKeys)}
              onChange={(e) => onChange({ transformObjectKeys: e.target.checked })}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-slate-200 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-slate-200">Transform Object Keys</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Turns obj.key access into bracketed obfuscated lookups</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};
