/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ReflectionMode } from '../../types/reflection';
import { Ear, Search, RefreshCw, Lightbulb } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: ReflectionMode;
  onSelectMode: (mode: ReflectionMode) => void;
  disabled?: boolean;
}

interface ModeConfig {
  key: ReflectionMode;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
}

const MODES: ModeConfig[] = [
  {
    key: 'listen',
    label: 'Listen',
    tagline: 'Give the thought room.',
    icon: Ear,
    accentClass: 'text-[#9B94BE]',
  },
  {
    key: 'understand',
    label: 'Understand',
    tagline: 'Notice what may be underneath it.',
    icon: Search,
    accentClass: 'text-[#E2C48D]',
  },
  {
    key: 'reframe',
    label: 'Reframe',
    tagline: 'Try another angle.',
    icon: RefreshCw,
    accentClass: 'text-[#B4A2E6]',
  },
  {
    key: 'brainstorm',
    label: 'Brainstorm',
    tagline: 'Explore what could come next.',
    icon: Lightbulb,
    accentClass: 'text-[#E2C48D]',
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <label className="text-xs uppercase tracking-wider text-[#9B94BE] font-medium">
          Reflection Mode
        </label>
        <span className="text-[11px] text-[#9B94BE]/70">
          Adapts how Lunara listens and responds
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MODES.map((mode) => {
          const isSelected = currentMode === mode.key;
          const Icon = mode.icon;

          return (
            <button
              key={mode.key}
              id={`mode-btn-${mode.key}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMode(mode.key)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#161B2E] border-[#E2C48D]/60 shadow-[0_0_15px_-3px_rgba(226,196,141,0.15)] ring-1 ring-[#E2C48D]/30'
                  : 'bg-[#121724]/60 border-[#1E2638] hover:border-[#2E3A54] hover:bg-[#161B2E]/40'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`text-xs font-semibold tracking-wide ${isSelected ? 'text-[#FDFCF7]' : 'text-[#9B94BE]'}`}>
                  {mode.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${mode.accentClass}`} />
              </div>
              <p className="text-[11px] text-[#9B94BE]/80 leading-snug line-clamp-2 font-light">
                {mode.tagline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
