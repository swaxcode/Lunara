/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';

interface NightSkyBackdropProps {
  className?: string;
  showHorizonGlow?: boolean;
}

/**
 * Multi-layered 2.5D Celestial Milky Way backdrop.
 * Reproduces the natural depth, broad diagonal dusty-violet stardust band,
 * faint horizon amber warmth, and distant pinpoints of light from the night-sky reference.
 */
export const NightSkyBackdrop: React.FC<NightSkyBackdropProps> = ({
  className = '',
  showHorizonGlow = true,
}) => {
  // Deterministic field of tiny distant background stars (never clickable)
  const distantStars = useMemo(() => {
    // Generate ~65 delicate background starlight specks
    const stars: Array<{ id: number; cx: number; cy: number; r: number; opacity: number; color: string }> = [];
    const seedPoints = [
      // Cluster along the diagonal Milky Way band (approx 20% to 80% along diagonal)
      { x: 15, y: 80, r: 0.8, o: 0.5, c: '#E2C48D' },
      { x: 22, y: 75, r: 0.6, o: 0.4, c: '#FDFCF7' },
      { x: 28, y: 68, r: 1.1, o: 0.65, c: '#FDFCF7' },
      { x: 35, y: 60, r: 0.7, o: 0.55, c: '#B4A2E6' },
      { x: 42, y: 52, r: 1.2, o: 0.7, c: '#E2C48D' },
      { x: 48, y: 44, r: 0.9, o: 0.6, c: '#FDFCF7' },
      { x: 55, y: 38, r: 1.3, o: 0.75, c: '#FDFCF7' },
      { x: 62, y: 30, r: 0.7, o: 0.5, c: '#9B94BE' },
      { x: 70, y: 22, r: 1.1, o: 0.65, c: '#E2C48D' },
      { x: 78, y: 15, r: 0.8, o: 0.55, c: '#FDFCF7' },
      { x: 85, y: 10, r: 1.2, o: 0.6, c: '#B4A2E6' },
      // Surrounding sky dispersion
      { x: 8, y: 20, r: 0.8, o: 0.35, c: '#FDFCF7' },
      { x: 12, y: 40, r: 0.7, o: 0.4, c: '#7AA8B8' },
      { x: 18, y: 12, r: 0.9, o: 0.45, c: '#E2C48D' },
      { x: 25, y: 30, r: 0.6, o: 0.3, c: '#FDFCF7' },
      { x: 32, y: 18, r: 1.0, o: 0.5, c: '#FDFCF7' },
      { x: 40, y: 25, r: 0.7, o: 0.35, c: '#9B94BE' },
      { x: 50, y: 15, r: 0.8, o: 0.4, c: '#E2C48D' },
      { x: 60, y: 12, r: 1.1, o: 0.55, c: '#FDFCF7' },
      { x: 72, y: 8, r: 0.7, o: 0.35, c: '#FDFCF7' },
      { x: 88, y: 28, r: 0.8, o: 0.4, c: '#7AA8B8' },
      { x: 92, y: 18, r: 1.0, o: 0.45, c: '#E2C48D' },
      { x: 95, y: 45, r: 0.7, o: 0.3, c: '#FDFCF7' },
      { x: 82, y: 55, r: 0.9, o: 0.4, c: '#9B94BE' },
      { x: 74, y: 65, r: 0.6, o: 0.35, c: '#FDFCF7' },
      { x: 65, y: 72, r: 1.0, o: 0.45, c: '#E2C48D' },
      { x: 52, y: 82, r: 0.7, o: 0.3, c: '#FDFCF7' },
      { x: 38, y: 88, r: 0.8, o: 0.4, c: '#B4A2E6' },
      { x: 10, y: 92, r: 0.9, o: 0.35, c: '#FDFCF7' },
      { x: 85, y: 85, r: 0.7, o: 0.3, c: '#E2C48D' },
      { x: 5, y: 60, r: 0.6, o: 0.25, c: '#FDFCF7' },
      { x: 94, y: 70, r: 0.8, o: 0.35, c: '#FDFCF7' },
      // Dense dust grains inside Milky Way band
      { x: 30, y: 64, r: 0.5, o: 0.6, c: '#FDFCF7' },
      { x: 36, y: 58, r: 0.6, o: 0.7, c: '#E2C48D' },
      { x: 44, y: 48, r: 0.5, o: 0.55, c: '#FDFCF7' },
      { x: 50, y: 42, r: 0.6, o: 0.65, c: '#FDFCF7' },
      { x: 57, y: 35, r: 0.5, o: 0.6, c: '#B4A2E6' },
      { x: 64, y: 26, r: 0.6, o: 0.7, c: '#E2C48D' },
      { x: 72, y: 20, r: 0.5, o: 0.55, c: '#FDFCF7' },
      { x: 26, y: 72, r: 0.6, o: 0.5, c: '#FDFCF7' },
      { x: 46, y: 56, r: 0.5, o: 0.6, c: '#E2C48D' },
      { x: 52, y: 50, r: 0.7, o: 0.65, c: '#FDFCF7' },
      { x: 59, y: 42, r: 0.5, o: 0.5, c: '#9B94BE' },
      { x: 67, y: 34, r: 0.6, o: 0.6, c: '#FDFCF7' },
    ];

    seedPoints.forEach((pt, i) => {
      stars.push({
        id: i,
        cx: pt.x,
        cy: pt.y,
        r: pt.r,
        opacity: pt.o,
        color: pt.c,
      });
    });

    return stars;
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#070A12] ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: Deep Obsidian / Midnight Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070D] via-[#080C17] to-[#0A0E1A]" />

      {/* Layer 2: Diffuse Indigo & Violet Cosmic Haze */}
      <div className="absolute inset-0 animate-cosmic-haze opacity-70">
        {/* Core celestial nebula glow */}
        <div
          className="absolute -top-1/4 -right-1/4 w-[90vw] h-[90vw] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(122, 168, 184, 0.12) 0%, rgba(155, 148, 190, 0.08) 45%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[75vw] h-[65vw] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(180, 162, 230, 0.14) 0%, rgba(22, 27, 46, 0.25) 50%, transparent 75%)',
          }}
        />
      </div>

      {/* Layer 3: Broad Diagonal Milky-Way Stardust Band (inspired by reference photo) */}
      <div className="absolute inset-0 animate-milky-way opacity-85">
        {/* Diagonal Milky Way stream from bottom-left to top-right */}
        <div
          className="absolute w-[180%] h-[55vh] -left-[40%] top-[25%] -rotate-[32deg] blur-[80px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(155, 148, 190, 0.09) 25%, rgba(226, 196, 141, 0.13) 45%, rgba(180, 162, 230, 0.16) 55%, rgba(122, 168, 184, 0.10) 75%, transparent 95%)',
          }}
        />
        {/* Secondary denser stardust core with subtle dark rift contrast */}
        <div
          className="absolute w-[140%] h-[28vh] -left-[20%] top-[40%] -rotate-[32deg] blur-[55px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 15%, rgba(244, 240, 232, 0.11) 40%, rgba(226, 196, 141, 0.15) 50%, rgba(155, 148, 190, 0.12) 65%, transparent 88%)',
          }}
        />
        {/* Dark nebula dust lane contrast */}
        <div
          className="absolute w-[120%] h-[8vh] -left-[10%] top-[46%] -rotate-[32deg] blur-[30px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 20%, rgba(7, 10, 18, 0.35) 45%, rgba(7, 10, 18, 0.25) 60%, transparent 80%)',
          }}
        />
      </div>

      {/* Layer 4: Distant Horizon Warm Amber Haze (evoking lower mountain horizon in reference photo) */}
      {showHorizonGlow && (
        <div className="absolute inset-x-0 bottom-0 h-48 animate-horizon-amber pointer-events-none">
          <div
            className="w-full h-full blur-[70px]"
            style={{
              background:
                'linear-gradient(to top, rgba(226, 160, 85, 0.14) 0%, rgba(226, 196, 141, 0.07) 45%, transparent 100%)',
            }}
          />
          {/* Subtle silhouette line at the very bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#05070D] to-transparent" />
        </div>
      )}

      {/* Layer 5: Sparse Distant Static Background Stars (SVG pinpoints) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {distantStars.map((star) => (
          <circle
            key={star.id}
            cx={star.cx}
            cy={star.cy}
            r={star.r * 0.35}
            fill={star.color}
            opacity={star.opacity}
          />
        ))}
      </svg>
    </div>
  );
};
