/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConstellationMemoryData, OpenThread, LanternInsight } from '../../types/reflection';
import { Sparkles, X, Compass, Flame, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface CrystallizeReviewProps {
  memoryData: ConstellationMemoryData;
  lantern: LanternInsight | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: (finalData: {
    title: string;
    summary: string;
    themes: string[];
    openThread: OpenThread | null;
  }) => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
}

export const CrystallizeReview: React.FC<CrystallizeReviewProps> = ({
  memoryData,
  lantern,
  isOpen,
  onClose,
  onConfirmSave,
  isSaving,
  saveError,
}) => {
  const [title, setTitle] = useState(memoryData.title);
  const [summary, setSummary] = useState(memoryData.summary);
  const [themeInput, setThemeInput] = useState(memoryData.themes.join(', '));
  const [includeOpenThread, setIncludeOpenThread] = useState(Boolean(memoryData.openThread?.exists));
  const [openQuestion, setOpenQuestion] = useState(memoryData.openThread?.question || '');
  const [openReason, setOpenReason] = useState(memoryData.openThread?.reason || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const themes = themeInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    const openThread: OpenThread | null = includeOpenThread && openQuestion.trim()
      ? {
          exists: true,
          question: openQuestion.trim(),
          reason: openReason.trim(),
          status: 'open',
          updatedAt: Date.now(),
        }
      : null;

    await onConfirmSave({
      title: title.trim() || 'Quiet Reflection',
      summary: summary.trim() || 'A mindful conversation preserved in time.',
      themes: themes.length > 0 ? themes : ['Reflection'],
      openThread,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#121724] border border-[#2E3A54] p-6 sm:p-8 text-[#FDFCF7] shadow-[0_0_60px_-15px_rgba(11,15,25,0.9)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crystallize-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1E2638] mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#E2C48D]/15 border border-[#E2C48D]/40 flex items-center justify-center text-[#E2C48D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="crystallize-title" className="font-serif text-2xl text-[#FDFCF7] font-medium tracking-wide">
                Crystallize Constellation Memory
              </h2>
              <p className="text-xs text-[#9B94BE] font-light">
                Review and refine this distillation before placing it as a star in your Inner Sky.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-[#9B94BE] hover:text-[#FDFCF7] p-1.5 rounded-lg hover:bg-[#1E2638] transition-colors disabled:opacity-40"
            aria-label="Close review"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Error Banner */}
        {saveError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <div className="flex-1">
              <span className="font-semibold block">Saving failed:</span>
              <span>{saveError} Your reflection has been preserved. Please retry saving.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field: THE SHAPE OF THIS THOUGHT */}
          <div>
            <label htmlFor="memory-title" className="block text-[11px] uppercase tracking-widest text-[#E2C48D] mb-1.5 font-medium">
              The Shape of this Thought
            </label>
            <input
              id="memory-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E2638] focus:border-[#E2C48D] focus:ring-1 focus:ring-[#E2C48D] text-sm text-[#FDFCF7] outline-none font-serif tracking-wide"
            />
          </div>

          {/* Summary Field: SUMMARY */}
          <div>
            <label htmlFor="memory-summary" className="block text-[11px] uppercase tracking-widest text-[#9B94BE] mb-1.5 font-medium">
              Summary
            </label>
            <textarea
              id="memory-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={1500}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E2638] focus:border-[#E2C48D] focus:ring-1 focus:ring-[#E2C48D] text-xs text-[#FDFCF7] outline-none leading-relaxed resize-none font-light"
            />
          </div>

          {/* Themes Tags Field: THEMES */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="memory-themes" className="block text-[11px] uppercase tracking-widest text-[#9B94BE] font-medium">
                Themes
              </label>
              <span className="text-[10px] text-[#9B94BE]/70">comma-separated</span>
            </div>
            <input
              id="memory-themes"
              type="text"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E2638] focus:border-[#E2C48D] focus:ring-1 focus:ring-[#E2C48D] text-xs text-[#FDFCF7] outline-none"
              placeholder="e.g. Boundaries, Career Transitions, Patience"
            />
            {/* Live Theme Chips Preview */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {themeInput
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t.length > 0)
                .map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-[#161B2E] border border-[#2E3A54] text-[#E2C48D] text-[11px] font-light"
                  >
                    ✦ {t}
                  </span>
                ))}
            </div>
          </div>

          {/* Attached Lantern Note (if present): A GENTLE OBSERVATION */}
          {lantern && (
            <div className="p-4 rounded-xl bg-[#161B2E]/80 border border-[#E2C48D]/40 flex items-start space-x-3 shadow-sm">
              <Flame className="w-4 h-4 text-[#E2C48D] shrink-0 mt-0.5 fill-[#E2C48D]/30" />
              <div className="text-xs">
                <span className="text-[#E2C48D] font-medium uppercase tracking-wider text-[11px] block mb-0.5">
                  A Gentle Observation
                </span>
                <p className="text-[#FDFCF7]/95 italic font-serif text-sm leading-relaxed">"{lantern.synthesis}"</p>
              </div>
            </div>
          )}

          {/* Open Thread Section: OPEN THREAD */}
          <div className="p-4 rounded-xl bg-[#0B0F19]/60 border border-[#1E2638] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-[#7AA8B8]" />
                <span className="text-[11px] uppercase tracking-widest font-medium text-[#FDFCF7]">
                  Open Thread
                </span>
              </div>
              <label className="flex items-center space-x-2 text-xs text-[#9B94BE] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOpenThread}
                  onChange={(e) => setIncludeOpenThread(e.target.checked)}
                  className="rounded border-[#1E2638] text-[#7AA8B8] focus:ring-0 bg-[#0B0F19]"
                />
                <span>Include in Constellation</span>
              </label>
            </div>

            {includeOpenThread && (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label htmlFor="thread-question" className="block text-[11px] text-[#9B94BE] mb-1">
                    The question to revisit later:
                  </label>
                  <input
                    id="thread-question"
                    type="text"
                    value={openQuestion}
                    onChange={(e) => setOpenQuestion(e.target.value)}
                    placeholder="e.g. Am I protecting my peace, or avoiding discomfort?"
                    className="w-full px-3 py-2 rounded-lg bg-[#121724] border border-[#1E2638] focus:border-[#7AA8B8] text-xs text-[#FDFCF7] outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="thread-reason" className="block text-[11px] text-[#9B94BE] mb-1">
                    Why this remains open:
                  </label>
                  <input
                    id="thread-reason"
                    type="text"
                    value={openReason}
                    onChange={(e) => setOpenReason(e.target.value)}
                    placeholder="e.g. Needs more reflection after having the conversation."
                    className="w-full px-3 py-2 rounded-lg bg-[#121724] border border-[#1E2638] focus:border-[#7AA8B8] text-xs text-[#9B94BE] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1E2638]">
            <button
              id="btn-cancel-crystallize"
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs text-[#9B94BE] hover:text-[#FDFCF7] hover:bg-[#1E2638] transition-colors cursor-pointer"
            >
              Continue Conversing
            </button>

            <button
              id="btn-confirm-save-sky"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4F0E8] via-[#EBDDBF] to-[#E2C48D] text-[#0B0F19] text-xs font-semibold hover:opacity-95 active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(226,196,141,0.3)] flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="flex items-center space-x-1 mr-1" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19] animate-gemini-dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19] animate-gemini-dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19] animate-gemini-dot-3" />
                  </div>
                  <span>Placing in Inner Sky...</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 text-[#0B0F19]" />
                  <span>Save to Inner Sky</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
