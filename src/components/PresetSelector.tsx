import React from 'react';
import type { PresetTier } from '../types/obfuscator';

interface PresetSelectorProps {
  currentPreset: PresetTier;
  onSelect: (preset: PresetTier) => void;
  disabled?: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  onSelect,
  disabled,
}) => {
  const options: Array<{
    id: PresetTier;
    badge: string;
    title: string;
    description: string;
    attributes: string[];
  }> = [
    {
      id: 'light',
      badge: 'Tier 1',
      title: 'Lightweight Minify',
      description: 'Zero runtime degradation. Ideal for open utilities & high-traffic bundles.',
      attributes: ['Identifier Mangling', 'Single-line Compaction', '0% CPU Penalty'],
    },
    {
      id: 'balanced',
      badge: 'Tier 2 (Default)',
      title: 'Balanced Protection',
      description: 'Hardened strings and object keys with modest, predictable execution overhead.',
      attributes: ['Base64 String Extraction', 'Key Transformations', 'Rotated Index Lookups'],
    },
    {
      id: 'stealth',
      badge: 'Tier 3',
      title: 'Maximum Stealth',
      description: 'Aggressive reverse-engineering resistance for proprietary client algorithms.',
      attributes: ['Control-Flow Flattening', 'Dead-Code Injection', 'RC4 Multi-Layer Strings'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isSelected = currentPreset === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.id)}
            className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
              isSelected
                ? 'bg-[#141824] border-[#38435d] ring-1 ring-slate-400/20 shadow-md'
                : 'bg-[#0f1118] border-[#1d222f] hover:border-[#2b3347] hover:bg-[#131622]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {opt.badge}
                </span>
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isSelected ? 'bg-slate-200' : 'bg-slate-700'
                  }`}
                />
              </div>

              <h3 className="text-sm font-semibold text-slate-100 tracking-tight font-sans">
                {opt.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {opt.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1a1f2c] flex flex-wrap gap-1.5">
              {opt.attributes.map((attr, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#181d2a] text-slate-300 font-mono border border-[#242b3d]"
                >
                  {attr}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};
