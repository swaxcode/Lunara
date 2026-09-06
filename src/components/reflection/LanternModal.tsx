/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, X, Check, BookmarkPlus } from 'lucide-react';
import { LanternInsight } from '../../types/reflection';

interface LanternModalProps {
  lantern: LanternInsight | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToMemory: () => void;
  isSaved: boolean;
  isLoading?: boolean;
}

export const LanternModal: React.FC<LanternModalProps> = ({
  lantern,
  isOpen,
  onClose,
  onSaveToMemory,
  isSaved,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#161B2E] to-[#0E1320] border border-[#E2C48D]/40 p-6 sm:p-8 text-[#FDFCF7] shadow-[0_0_50px_-10px_rgba(226,196,141,0.25)] animate-lantern"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lantern-title"
      >
        {/* Close Button */}
        <button
          id="btn-close-lantern"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9B94BE] hover:text-[#FDFCF7] p-1 rounded-lg hover:bg-[#1E2638] transition-colors"
          aria-label="Dismiss Lantern"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#E2C48D]/15 border border-[#E2C48D]/50 flex items-center justify-center text-[#E2C48D] shadow-sm">
            <Flame className="w-5 h-5 fill-[#E2C48D]/30" />
          </div>
          <div>
            <h3 id="lantern-title" className="font-serif text-2xl text-[#E2C48D] font-normal tracking-wide">
              What seems clearer now
            </h3>
            <span className="text-xs text-[#9B94BE] tracking-wider uppercase font-light">
              A quiet light upon the conversation
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="my-6 p-6 rounded-2xl bg-[#0B0F19]/70 border border-[#E2C48D]/30 shadow-inner">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-2" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E2C48D] animate-gemini-dot-1" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#EBDDBF] animate-gemini-dot-2" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E2C48D] animate-gemini-dot-3" />
              </div>
              <p className="text-xs text-[#E2C48D] font-serif tracking-wider text-center">
                Kindling the lantern above your thoughts...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#E2C48D]/80 block">
                What seems clearer now:
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#FDFCF7] leading-relaxed italic">
                "{lantern?.synthesis}"
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            id="btn-dismiss-lantern"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs text-[#9B94BE] hover:text-[#FDFCF7] hover:bg-[#1E2638] transition-colors font-medium cursor-pointer"
          >
            Dismiss for now
          </button>

          {!isLoading && lantern && (
            <button
              id="btn-save-lantern-memory"
              type="button"
              onClick={onSaveToMemory}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#1E2638] text-[#E2C48D] border border-[#E2C48D]/40'
                  : 'bg-[#E2C48D] text-[#0B0F19] hover:bg-[#ebd3a6] shadow-[0_0_20px_-5px_rgba(226,196,141,0.4)]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Attached to this Reflection</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Attach Lantern to Reflection</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
