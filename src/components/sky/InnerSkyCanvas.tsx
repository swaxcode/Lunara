/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReflectionDocument } from '../../types/reflection';
import { Sparkles, Moon, Compass, Flame, HelpCircle } from 'lucide-react';
import { NightSkyBackdrop } from '../layout/NightSkyBackdrop';

interface InnerSkyCanvasProps {
  reflections: ReflectionDocument[];
  onSelectReflection: (reflection: ReflectionDocument) => void;
  onNavigateToReflect: () => void;
}

export const InnerSkyCanvas: React.FC<InnerSkyCanvasProps> = ({
  reflections,
  onSelectReflection,
  onNavigateToReflect,
}) => {
  const [hoveredStar, setHoveredStar] = useState<ReflectionDocument | null>(null);
  const [skyFilter, setSkyFilter] = useState<'all' | 'threads'>('all');

  // Intentional Empty State (Authentic empty sky for brand-new users)
  if (reflections.length === 0) {
    return (
      <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <NightSkyBackdrop />

        <div className="relative max-w-md p-9 sm:p-11 rounded-3xl bg-[#121724]/75 border border-[#1E2638]/80 flex flex-col items-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center mb-6 text-[#E2C48D] shadow-[0_0_25px_-5px_rgba(226,196,141,0.25)]">
            <Moon className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#FDFCF7] mb-3 font-normal tracking-wide">
            Your sky begins with your first thought.
          </h2>

          <p className="text-xs sm:text-sm text-[#9B94BE] leading-relaxed font-light mb-8 max-w-sm">
            When you reflect and crystallize a memory, it will take its place as an illuminated, permanent star in your private celestial expanse.
          </p>

          <button
            id="btn-empty-start-reflect"
            onClick={onNavigateToReflect}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F4F0E8] via-[#EBDDBF] to-[#E2C48D] text-[#0B0F19] text-xs font-semibold hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_0_25px_-5px_rgba(226,196,141,0.35)] flex items-center space-x-2.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0B0F19]" />
            <span>Begin a Reflection</span>
          </button>
        </div>
      </div>
    );
  }

  // Spectral color mapper
  const getSpectralColor = (hue: string) => {
    switch (hue) {
      case 'gold':
        return '#E2C48D';
      case 'lavender':
        return '#B4A2E6';
      case 'cyan':
        return '#7AA8B8';
      case 'ivory':
      default:
        return '#FDFCF7';
    }
  };

  const openThreads = reflections.filter(
    (r) => r.openThread?.exists && r.openThread?.status === 'open'
  );

  const displayedReflections =
    skyFilter === 'threads' ? openThreads : reflections;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Banner / Sky Status */}
      <div className="px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2638]/60 bg-[#0B0F19]/80 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center text-[#7AA8B8]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-base text-[#FDFCF7] font-medium tracking-wide">
                The Inner Sky
              </span>
              <span className="text-xs text-[#E2C48D]/90 font-light px-2.5 py-0.5 rounded-full bg-[#161B2E] border border-[#2E3A54]">
                {reflections.length} {reflections.length === 1 ? 'thought kept in your sky' : 'thoughts kept in your sky'}
              </span>
            </div>
            <p className="text-[11px] text-[#9B94BE] font-light mt-0.5">
              Each star preserves an authentic moment of reflection.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Constellation Threads Filter Toggle */}
          <div className="flex items-center rounded-xl bg-[#121724] border border-[#1E2638] p-1 text-xs">
            <button
              id="filter-all-stars"
              onClick={() => setSkyFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                skyFilter === 'all'
                  ? 'bg-[#161B2E] text-[#FDFCF7] font-medium border border-[#2E3A54]'
                  : 'text-[#9B94BE] hover:text-[#FDFCF7]'
              }`}
            >
              All Stars ({reflections.length})
            </button>
            <button
              id="filter-open-threads"
              onClick={() => setSkyFilter('threads')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                skyFilter === 'threads'
                  ? 'bg-[#161B2E] text-[#7AA8B8] font-medium border border-[#7AA8B8]/40'
                  : 'text-[#9B94BE] hover:text-[#7AA8B8]'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              <span>Still Unfolding ({openThreads.length})</span>
            </button>
          </div>

          <button
            id="btn-sky-new-reflection"
            onClick={onNavigateToReflect}
            className="px-4 py-1.5 rounded-xl text-xs bg-[#161B2E] hover:bg-[#1E2638] border border-[#2E3A54] text-[#E2C48D] transition-colors flex items-center space-x-1.5 cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reflect</span>
          </button>
        </div>
      </div>

      {/* Night Sky Celestial Observatory Canvas */}
      <div className="relative flex-1 w-full min-h-[580px] overflow-hidden select-none">
        <NightSkyBackdrop className="opacity-95" />

        {/* Constellation Connection Lines (Light geometric bridges between chronologically sequential stars) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {displayedReflections.length > 1 &&
            displayedReflections.map((star, idx) => {
              if (idx === 0) return null;
              const prev = displayedReflections[idx - 1];
              return (
                <line
                  key={`line-${star.id}-${prev.id}`}
                  x1={`${prev.starCoordinates.x}%`}
                  y1={`${prev.starCoordinates.y}%`}
                  x2={`${star.starCoordinates.x}%`}
                  y2={`${star.starCoordinates.y}%`}
                  stroke="rgba(226, 196, 141, 0.2)"
                  strokeWidth="0.8"
                  strokeDasharray="2,3"
                />
              );
            })}
        </svg>

        {/* Layer 4: User Reflection Stars (Deterministic coordinates, NO dotted circles or orbit rings) */}
        {displayedReflections.map((reflection, idx) => {
          const { x, y, size, spectralHue } = reflection.starCoordinates;
          const color = getSpectralColor(spectralHue);
          const isHovered = hoveredStar?.id === reflection.id;
          const hasOpenThread =
            reflection.openThread?.exists && reflection.openThread?.status === 'open';

          // Organic, low-amplitude, asynchronous twinkle cycle (100% -> 92% -> 100% -> 96% -> 100%)
          const twinkleVariants = [
            'animate-star-twinkle-1',
            'animate-star-twinkle-2',
            'animate-star-twinkle-3',
            'animate-star-twinkle-4',
          ];
          const twinkleClass = twinkleVariants[idx % twinkleVariants.length];
          const animDelay = `${((idx * 1.73) % 4.5).toFixed(2)}s`;

          return (
            <div
              key={reflection.id}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group focus:outline-none"
              onClick={() => onSelectReflection(reflection)}
              onMouseEnter={() => setHoveredStar(reflection)}
              onMouseLeave={() => setHoveredStar(null)}
              role="button"
              tabIndex={0}
              aria-label={`Reflection star: ${reflection.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectReflection(reflection);
                }
              }}
            >
              {/* Hit target padding (Ensures at least 44px comfortable touch/click area; never animated) */}
              <div className="w-12 h-12 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 focus-visible:ring-2 focus-visible:ring-[#E2C48D]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19] rounded-full">
                {/* Natural starlight halo / soft glow (No dotted or segmented rings of any kind) */}
                <div
                  className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
                    isHovered
                      ? 'scale-175 opacity-90'
                      : 'scale-125 opacity-40 group-hover:opacity-80'
                  }`}
                  style={{
                    width: `${size * 3.5}px`,
                    height: `${size * 3.5}px`,
                    backgroundColor: color,
                    filter: 'blur(6px)',
                  }}
                />

                {/* Core Star Body: Asynchronous organic twinkle, stable spatial position, no orbit ring */}
                <div
                  className={`relative rounded-full transition-all duration-300 ${
                    isHovered ? 'scale-125 brightness-125' : twinkleClass
                  }`}
                  style={{
                    width: `${isHovered ? size + 2 : size}px`,
                    height: `${isHovered ? size + 2 : size}px`,
                    backgroundColor: color,
                    boxShadow: isHovered
                      ? `0 0 16px 3px ${color}, 0 0 28px 6px ${color}77`
                      : `0 0 ${Math.max(5, size * 1.4)}px ${color}bb`,
                    animationDelay: animDelay,
                  }}
                />
              </div>

              {/* Title Tag on Hover / Focus */}
              {isHovered && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-5 pointer-events-none z-30 min-w-[220px] max-w-[280px] p-3.5 rounded-2xl bg-[#121724]/95 border border-[#2E3A54] text-[#FDFCF7] shadow-2xl backdrop-blur-md"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#9B94BE] mb-1">
                    <span>{new Date(reflection.createdAt).toLocaleDateString()}</span>
                    <span className="capitalize text-[#E2C48D]">{reflection.mode} mode</span>
                  </div>
                  <h4 className="font-serif text-sm font-medium text-[#FDFCF7] leading-snug line-clamp-1">
                    {reflection.title}
                  </h4>
                  <p className="text-[11px] text-[#9B94BE] line-clamp-2 mt-1 leading-normal font-light">
                    {reflection.summary}
                  </p>

                  <div className="flex flex-col space-y-1 mt-2 pt-2 border-t border-[#1E2638] text-[10px]">
                    <div className="flex items-center space-x-2">
                      {reflection.lantern && (
                        <span className="flex items-center text-[#E2C48D]">
                          <Flame className="w-3 h-3 mr-1" /> Lantern
                        </span>
                      )}
                      {reflection.openThread?.exists && (
                        <span className="flex items-center text-[#7AA8B8]">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          <span>{hasOpenThread ? 'Still unfolding' : 'Resolved'}</span>
                        </span>
                      )}
                    </div>
                    {hasOpenThread && (
                      <p className="text-[#7AA8B8] font-serif italic line-clamp-1">
                        "{reflection.openThread.question}"
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
