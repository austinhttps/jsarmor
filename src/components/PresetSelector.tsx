import React from 'react';
import { Zap, ShieldCheck, Skull } from 'lucide-react';
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
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'light',
      title: 'Light (Performance)',
      description: 'Mangles variables & minifies. Zero overhead.',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 hover:border-emerald-500/60',
    },
    {
      id: 'balanced',
      title: 'Balanced (Standard)',
      description: 'String arrays, base64 encryption & object transformation.',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500/30 hover:border-cyan-500/60',
    },
    {
      id: 'stealth',
      title: 'Stealth (High Security)',
      description: 'Control flow flattening, dead code injection & RC4 strings.',
      icon: <Skull className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/30 hover:border-purple-500/60',
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
            className={`text-left p-3 rounded-xl border transition flex items-start space-x-3 ${
              isSelected
                ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/40 shadow-md'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-100">{opt.title}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug truncate">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
