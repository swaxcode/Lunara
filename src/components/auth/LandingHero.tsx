/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Moon, Compass, ShieldCheck, Feather, Flame } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { signInWithGoogle, loading, authError, clearAuthError } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background celestial atmosphere layers */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Layer 1: Midnight indigo haze */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#161B2E]/70 via-[#1F2238]/30 to-transparent rounded-full blur-3xl opacity-80" />
        
        {/* Layer 2: Soft distant galaxy mist */}
        <div className="absolute top-1/4 -left-20 w-[450px] h-[350px] bg-[#2A2B45]/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[400px] bg-[#16223A]/30 rounded-full blur-[110px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[250px] bg-[#E2C48D]/5 rounded-full blur-[90px]" />

        {/* Layer 3: Faint background stars (static, delicate) */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <circle cx="8%" cy="18%" r="1" fill="#FDFCF7" opacity="0.6" />
          <circle cx="15%" cy="32%" r="1.2" fill="#E2C48D" opacity="0.7" />
          <circle cx="22%" cy="12%" r="0.8" fill="#FDFCF7" opacity="0.5" />
          <circle cx="28%" cy="45%" r="1" fill="#B4A2E6" opacity="0.6" />
          <circle cx="36%" cy="25%" r="1.4" fill="#FDFCF7" opacity="0.7" />
          <circle cx="48%" cy="15%" r="1" fill="#7AA8B8" opacity="0.5" />
          <circle cx="62%" cy="28%" r="1.2" fill="#E2C48D" opacity="0.6" />
          <circle cx="71%" cy="14%" r="0.9" fill="#FDFCF7" opacity="0.6" />
          <circle cx="79%" cy="36%" r="1.3" fill="#B4A2E6" opacity="0.7" />
          <circle cx="86%" cy="20%" r="1" fill="#FDFCF7" opacity="0.5" />
          <circle cx="92%" cy="48%" r="1.2" fill="#7AA8B8" opacity="0.6" />
          <circle cx="12%" cy="65%" r="0.9" fill="#FDFCF7" opacity="0.5" />
          <circle cx="25%" cy="78%" r="1.1" fill="#E2C48D" opacity="0.6" />
          <circle cx="42%" cy="72%" r="0.8" fill="#FDFCF7" opacity="0.4" />
          <circle cx="68%" cy="82%" r="1" fill="#B4A2E6" opacity="0.5" />
          <circle cx="84%" cy="70%" r="1.2" fill="#FDFCF7" opacity="0.6" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex-1 flex flex-col items-center text-center">
        {/* Celestial Sanctuary Monogram */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#161B2E]/90 border border-[#2E3A54] text-[#E2C48D] text-xs tracking-widest uppercase mb-8 shadow-sm backdrop-blur-sm">
          <Moon className="w-3.5 h-3.5 text-[#E2C48D]" />
          <span>A private sanctuary for your thoughts</span>
        </div>

        {/* Editorial Brand / Title */}
        <span className="font-serif text-sm sm:text-base tracking-[0.3em] uppercase text-[#E2C48D] mb-4 font-light">
          LUNARA
        </span>

        {/* Major Headline - Exact Specified Hero Copy */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#FDFCF7] tracking-tight leading-[1.18] max-w-3xl mb-8 font-normal">
          Think aloud.<br />
          Gather the fragments.<br />
          <span className="text-[#E2C48D]/90">Return to what was left unfinished.</span>
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-[#9B94BE] text-base sm:text-lg max-w-xl leading-relaxed font-light mb-10">
          A calm nocturnal companion to explore your thoughts, uncover gentle perspectives, and preserve meaningful moments as constellation stars.
        </p>

        {/* Auth Error Banner if present */}
        {authError && (
          <div className="mb-8 p-3.5 px-5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center justify-between max-w-md backdrop-blur-sm">
            <span>{authError}</span>
            <button
              onClick={clearAuthError}
              className="ml-3 text-red-400 hover:text-red-200 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Primary CTA Button */}
        <div className="flex flex-col items-center space-y-3.5 w-full sm:w-auto">
          <button
            id="btn-google-signin"
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-[#F4F0E8] via-[#EBDDBF] to-[#E2C48D] text-[#0B0F19] font-medium text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_0_35px_-5px_rgba(226,196,141,0.4)] flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
          >
            {/* Minimalist Google 'G' icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-semibold tracking-wide text-sm">Begin your reflection</span>
          </button>

          {/* Exact Specified Privacy Line */}
          <span className="text-xs text-[#9B94BE]/80 font-light tracking-wide flex items-center space-x-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7AA8B8]" />
            <span>A little space that belongs to you.</span>
          </span>
        </div>

        {/* The Reflection Journey: Editorial Vignettes */}
        <div className="mt-20 sm:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          {/* Pillar 1: Reflection */}
          <div className="p-7 rounded-2xl bg-[#121724]/60 border border-[#1E2638] hover:border-[#2E3A54] transition-all backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center mb-5 text-[#E2C48D]">
              <Feather className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl text-[#FDFCF7] mb-2 font-normal">Thought to understanding</h2>
            <p className="text-xs text-[#9B94BE] leading-relaxed font-light">
              Type your thoughts freely. Lunara responds without judgment across four gentle modes of listening, inquiry, reframing, and ideation.
            </p>
          </div>

          {/* Pillar 2: The Lantern */}
          <div className="p-7 rounded-2xl bg-[#121724]/60 border border-[#1E2638] hover:border-[#2E3A54] transition-all backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center mb-5 text-[#E2C48D]">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl text-[#FDFCF7] mb-2 font-normal">Light a lantern</h2>
            <p className="text-xs text-[#9B94BE] leading-relaxed font-light">
              Pause mid-thought to illuminate the single core realization, emerging question, or quiet contradiction in your conversation.
            </p>
          </div>

          {/* Pillar 3: Inner Sky */}
          <div className="p-7 rounded-2xl bg-[#121724]/60 border border-[#1E2638] hover:border-[#2E3A54] transition-all backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center mb-5 text-[#7AA8B8]">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl text-[#FDFCF7] mb-2 font-normal">Your Inner Sky</h2>
            <p className="text-xs text-[#9B94BE] leading-relaxed font-light">
              Every preserved reflection takes its permanent place as a star in your personal celestial observatory.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1E2638]/40 py-6 text-center text-xs text-[#9B94BE]/50">
        <p>Lunara • Your private notion observatory</p>
      </footer>
    </div>
  );
};
