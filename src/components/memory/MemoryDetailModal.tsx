/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReflectionDocument, OpenThread } from '../../types/reflection';
import { X, Flame, HelpCircle, Calendar, Sparkles, Trash2, CheckCircle2, EyeOff, MessageSquare, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface MemoryDetailModalProps {
  reflection: ReflectionDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOpenThread?: (reflectionId: string, updatedThread: OpenThread | null) => Promise<void>;
  onDeleteReflection?: (reflectionId: string) => Promise<void>;
  onRevisitThread?: (reflection: ReflectionDocument) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  reflection,
  isOpen,
  onClose,
  onUpdateOpenThread,
  onDeleteReflection,
  onRevisitThread,
}) => {
  const [showConversation, setShowConversation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingThread, setIsUpdatingThread] = useState(false);

  if (!isOpen || !reflection) return null;

  const formattedDate = new Date(reflection.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleThreadStatus = async (status: 'closed' | 'dismissed' | 'open') => {
    if (!reflection.openThread || !onUpdateOpenThread) return;
    setIsUpdatingThread(true);
    try {
      const updated: OpenThread = {
        ...reflection.openThread,
        status,
        updatedAt: Date.now(),
      };
      await onUpdateOpenThread(reflection.id, updated);
    } finally {
      setIsUpdatingThread(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteReflection) return;
    if (window.confirm('Are you sure you wish to dissolve this constellation star? This action is permanent.')) {
      setIsDeleting(true);
      try {
        await onDeleteReflection(reflection.id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl my-8 rounded-2xl bg-[#121724] border border-[#2E3A54] p-6 sm:p-8 text-[#FDFCF7] shadow-[0_0_60px_-15px_rgba(11,15,25,0.9)] max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-detail-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-[#1E2638]">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs text-[#9B94BE] font-light">
              <Calendar className="w-3.5 h-3.5 text-[#E2C48D]" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="capitalize text-[#E2C48D]">{reflection.mode} mode</span>
            </div>
            <h2 id="memory-detail-title" className="font-serif text-3xl sm:text-4xl text-[#FDFCF7] font-normal tracking-tight leading-snug">
              {reflection.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#9B94BE] hover:text-[#FDFCF7] p-2 rounded-xl hover:bg-[#1E2638] transition-colors cursor-pointer"
            aria-label="Close memory details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Summary / Distillation */}
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#9B94BE] font-mono block mb-2">
              Distillation
            </span>
            <div className="bg-[#0B0F19]/70 p-5 rounded-2xl border border-[#1E2638] shadow-inner">
              <p className="font-serif text-lg sm:text-xl text-[#FDFCF7]/95 leading-relaxed font-light italic">
                "{reflection.summary}"
              </p>
            </div>
          </div>

          {/* Themes Chips */}
          {reflection.themes && reflection.themes.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#9B94BE] font-mono block mb-2">
                Themes & Resonances
              </span>
              <div className="flex flex-wrap gap-2">
                {reflection.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1 rounded-full text-xs bg-[#161B2E] border border-[#2E3A54] text-[#E2C48D] font-light shadow-sm"
                  >
                    ✦ {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Saved Lantern Insight (if present) */}
          {reflection.lantern && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#161B2E] via-[#1A2035] to-[#121724] border border-[#E2C48D]/40 shadow-[0_0_30px_-8px_rgba(226,196,141,0.15)]">
              <div className="flex items-center space-x-2 text-[#E2C48D] mb-2">
                <Flame className="w-4 h-4 fill-[#E2C48D]/40" />
                <span className="text-xs uppercase tracking-wider font-medium">Illuminated Lantern Realization</span>
              </div>
              <p className="font-serif text-base sm:text-lg text-[#FDFCF7] italic leading-relaxed">
                "{reflection.lantern.synthesis}"
              </p>
            </div>
          )}

          {/* Open Thread Section (if present) */}
          {reflection.openThread && reflection.openThread.exists && (
            <div className="p-5 rounded-2xl bg-[#0B0F19]/80 border border-[#7AA8B8]/40 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2 text-[#7AA8B8]">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Still Unfolding</span>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono ${
                    reflection.openThread.status === 'closed'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      : reflection.openThread.status === 'dismissed'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-[#7AA8B8]/20 text-[#7AA8B8] border border-[#7AA8B8]/40'
                  }`}
                >
                  {reflection.openThread.status === 'open' ? 'inquiry active' : reflection.openThread.status}
                </span>
              </div>

              <p className="font-serif text-base sm:text-lg text-[#FDFCF7] font-normal mb-1 leading-snug">
                "{reflection.openThread.question}"
              </p>
              {reflection.openThread.reason && (
                <p className="text-xs text-[#9B94BE] font-light mb-4">
                  {reflection.openThread.reason}
                </p>
              )}

              {/* Status Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1E2638]">
                {onUpdateOpenThread && (
                  <div className="flex items-center space-x-2">
                    {reflection.openThread.status !== 'closed' && (
                      <button
                        onClick={() => handleThreadStatus('closed')}
                        disabled={isUpdatingThread}
                        className="px-3 py-1.5 rounded-lg text-[11px] bg-[#161B2E] text-emerald-300 hover:bg-[#1E2638] border border-emerald-800/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark as Resolved</span>
                      </button>
                    )}
                    {reflection.openThread.status !== 'dismissed' && (
                      <button
                        onClick={() => handleThreadStatus('dismissed')}
                        disabled={isUpdatingThread}
                        className="px-3 py-1.5 rounded-lg text-[11px] bg-[#161B2E] text-zinc-400 hover:bg-[#1E2638] border border-zinc-700/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Dismiss</span>
                      </button>
                    )}
                    {reflection.openThread.status !== 'open' && (
                      <button
                        onClick={() => handleThreadStatus('open')}
                        disabled={isUpdatingThread}
                        className="px-3 py-1.5 rounded-lg text-[11px] bg-[#161B2E] text-[#7AA8B8] hover:bg-[#1E2638] border border-[#7AA8B8]/40 transition-colors cursor-pointer"
                      >
                        <span>Re-open Thread</span>
                      </button>
                    )}
                  </div>
                )}

                {onRevisitThread && (
                  <button
                    id="btn-revisit-thread"
                    onClick={() => {
                      onRevisitThread(reflection);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs bg-[#7AA8B8]/15 hover:bg-[#7AA8B8]/25 text-[#7AA8B8] border border-[#7AA8B8]/40 flex items-center space-x-1.5 transition-all cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revisit this thread</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Collapsible Conversation History */}
          <div className="border-t border-[#1E2638] pt-4">
            <button
              onClick={() => setShowConversation(!showConversation)}
              className="flex items-center justify-between w-full text-xs text-[#9B94BE] hover:text-[#FDFCF7] py-1.5 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#E2C48D]" />
                <span>Original Conversation ({reflection.conversation?.length || 0} turns)</span>
              </div>
              {showConversation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showConversation && (
              <div className="mt-3 space-y-3 pt-2">
                {reflection.conversation?.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#161B2E] text-[#FDFCF7] ml-4 border border-[#2E3A54]'
                        : 'bg-[#0B0F19] text-[#FDFCF7]/90 mr-4 border border-[#1E2638] font-serif text-sm'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block mb-1 font-mono text-[#E2C48D]/70">
                      {msg.role === 'user' ? 'You' : 'Lunara'}
                    </span>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1E2638] mt-2">
          {onDeleteReflection ? (
            <button
              id="btn-delete-reflection"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-red-400/80 hover:text-red-300 p-2 rounded-lg hover:bg-red-950/20 flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Dissolving...' : 'Dissolve Star'}</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs bg-[#1E2638] hover:bg-[#2E3A54] text-[#FDFCF7] font-medium transition-colors cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
