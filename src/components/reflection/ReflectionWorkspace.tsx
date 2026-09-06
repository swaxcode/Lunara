/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ReflectionMode,
  ChatMessage,
  LanternInsight,
  ConstellationMemoryData,
  OpenThread,
} from '../../types/reflection';
import { ModeSelector } from './ModeSelector';
import { LanternModal } from './LanternModal';
import { CrystallizeReview } from '../memory/CrystallizeReview';
import { sendReflectionTurn, lightLantern, crystallizeMemory } from '../../lib/api';
import { deriveStarCoordinates } from '../../lib/coordinates';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import {
  Send,
  Flame,
  Sparkles,
  RefreshCw,
  AlertCircle,
  RotateCcw,
  Moon,
  Feather,
} from 'lucide-react';

export interface ResumedThreadInfo {
  reflectionId: string;
  mode: ReflectionMode;
  title: string;
  question: string;
  conversation: ChatMessage[];
}

interface ReflectionWorkspaceProps {
  onReflectionSaved: () => void;
  resumedThread?: ResumedThreadInfo | null;
  onClearResumedThread?: () => void;
}

export const ReflectionWorkspace: React.FC<ReflectionWorkspaceProps> = ({
  onReflectionSaved,
  resumedThread,
  onClearResumedThread,
}) => {
  const { user, getIdToken } = useAuth();

  // Session state
  const [mode, setMode] = useState<ReflectionMode>('listen');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);

  // Synchronize resumed thread if passed from a Constellation Thread revisit
  useEffect(() => {
    if (resumedThread) {
      setMode(resumedThread.mode);
      setConversation(resumedThread.conversation);
      setError(null);
    }
  }, [resumedThread]);

  // Lantern state
  const [lantern, setLantern] = useState<LanternInsight | null>(null);
  const [isLightingLantern, setIsLightingLantern] = useState(false);
  const [isLanternModalOpen, setIsLanternModalOpen] = useState(false);
  const [isLanternSavedToMemory, setIsLanternSavedToMemory] = useState(false);

  // Memory Crystallization state
  const [crystallizeData, setCrystallizeData] = useState<ConstellationMemoryData | null>(null);
  const [isCrystallizing, setIsCrystallizing] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSavingToFirestore, setIsSavingToFirestore] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isResponding]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  /**
   * Send user message turn to Gemini
   */
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isResponding) return;

    setError(null);
    setFailedMessage(null);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: Date.now(),
    };

    // Update conversation locally first
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsResponding(true);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.');
      }

      // Format conversation turns for the backend
      const apiTurns = updatedConversation.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await sendReflectionTurn(token, mode, apiTurns);

      const modelMessage: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        text: res.text,
        timestamp: Date.now(),
      };

      setConversation([...updatedConversation, modelMessage]);
    } catch (err: any) {
      console.error('Failed to receive reflection turn:', err);
      setError(err.message || 'Lunara was unable to answer right now. Your message is preserved.');
      setFailedMessage(messageContent);
    } finally {
      setIsResponding(false);
    }
  };

  /**
   * Retry failed message
   */
  const handleRetry = () => {
    if (failedMessage) {
      handleSendMessage(failedMessage);
    }
  };

  /**
   * Trigger "Light a Lantern"
   */
  const handleLightLantern = async () => {
    if (conversation.length === 0 || isLightingLantern) return;

    setError(null);
    setIsLightingLantern(true);
    setIsLanternModalOpen(true);

    try {
      const token = await getIdToken();
      if (!token) throw new Error('Session expired.');

      const apiTurns = conversation.map((m) => ({ role: m.role, text: m.text }));
      const res = await lightLantern(token, apiTurns);

      setLantern({
        synthesis: res.synthesis,
      });
    } catch (err: any) {
      console.error('Failed to light lantern:', err);
      setError(err.message || 'Unable to light lantern. Please retry.');
      setIsLanternModalOpen(false);
    } finally {
      setIsLightingLantern(false);
    }
  };

  /**
   * Save lantern to the current reflection memory
   */
  const handleSaveLanternToMemory = () => {
    if (!lantern) return;
    setLantern({
      ...lantern,
      savedAt: Date.now(),
    });
    setIsLanternSavedToMemory(true);
  };

  /**
   * Trigger "Crystallize into Memory"
   */
  const handleCrystallize = async () => {
    if (conversation.length === 0 || isCrystallizing) return;

    setError(null);
    setSaveError(null);
    setIsCrystallizing(true);

    try {
      const token = await getIdToken();
      if (!token) throw new Error('Session expired.');

      const apiTurns = conversation.map((m) => ({ role: m.role, text: m.text }));
      const lanternText = isLanternSavedToMemory && lantern ? lantern.synthesis : undefined;

      const memory = await crystallizeMemory(token, apiTurns, mode, lanternText);
      setCrystallizeData(memory);
      setIsReviewModalOpen(true);
    } catch (err: any) {
      console.error('Crystallization error:', err);
      setError(err.message || 'Unable to distill reflection right now. Please retry.');
    } finally {
      setIsCrystallizing(false);
    }
  };

  /**
   * Save confirmed Constellation Memory to Firestore
   */
  const handleConfirmSaveToSky = async (finalData: {
    title: string;
    summary: string;
    themes: string[];
    openThread: OpenThread | null;
  }) => {
    if (!user) return;
    setIsSavingToFirestore(true);
    setSaveError(null);

    try {
      const now = Date.now();
      const reflectionsRef = collection(db, 'users', user.uid, 'reflections');
      const newDocRef = doc(reflectionsRef);

      // Deterministic star coordinates based on document ID and timestamp
      const starCoordinates = deriveStarCoordinates(newDocRef.id, now);

      const reflectionDoc = {
        id: newDocRef.id,
        userId: user.uid,
        mode,
        title: finalData.title,
        summary: finalData.summary,
        themes: finalData.themes,
        conversation: conversation.map((c) => ({
          role: c.role,
          text: c.text,
          timestamp: c.timestamp,
        })),
        lantern: isLanternSavedToMemory && lantern ? lantern : null,
        openThread: finalData.openThread,
        starCoordinates,
        createdAt: now,
        updatedAt: now,
      };

      // Write to Firestore /users/{uid}/reflections/{reflectionId}
      await setDoc(newDocRef, reflectionDoc);

      // Successfully saved! Clean up session
      setIsReviewModalOpen(false);
      setConversation([]);
      setInputText('');
      setLantern(null);
      setIsLanternSavedToMemory(false);
      setCrystallizeData(null);

      // Notify parent to switch view or refresh
      onReflectionSaved();
    } catch (err: any) {
      console.error('Firestore save failure:', err);
      setSaveError(err.message || 'Failed to save reflection to Firestore. Please retry.');
    } finally {
      setIsSavingToFirestore(false);
    }
  };

  /**
   * Reset session (New Reflection)
   */
  const handleResetSession = () => {
    if (conversation.length > 0) {
      if (!window.confirm('Start a fresh reflection? Unsaved thoughts in this session will be cleared.')) {
        return;
      }
    }
    setConversation([]);
    setInputText('');
    setLantern(null);
    setIsLanternSavedToMemory(false);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1">
      {/* Top Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#1E2638]">
        <div>
          <h2 className="font-serif text-2xl text-[#FDFCF7] font-medium tracking-wide flex items-center space-x-2">
            <span>Reflection Sanctuary</span>
          </h2>
          <p className="text-xs text-[#9B94BE] font-light">
            Speak what is on your mind. Lunara holds space with quiet clarity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {conversation.length > 0 && (
            <button
              id="btn-new-session"
              onClick={handleResetSession}
              className="text-xs text-[#9B94BE] hover:text-[#FDFCF7] px-3 py-1.5 rounded-lg hover:bg-[#161B2E] border border-[#1E2638] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New Reflection</span>
            </button>
          )}
        </div>
      </div>

      {/* Resumed Constellation Thread Banner */}
      {resumedThread && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#161B2E] border border-[#7AA8B8]/40 text-[#FDFCF7] text-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-4 h-4 text-[#E2C48D] shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-[#7AA8B8]">Resuming Constellation Thread</span>
                <span className="text-[10px] text-[#9B94BE] px-2 py-0.5 rounded-full bg-[#0B0F19] border border-[#1E2638]">
                  From "{resumedThread.title}"
                </span>
              </div>
              <p className="text-[#FDFCF7] italic font-serif text-sm mt-0.5">
                "{resumedThread.question}"
              </p>
            </div>
          </div>
          {onClearResumedThread && (
            <button
              onClick={onClearResumedThread}
              className="px-3 py-1 rounded-lg text-xs bg-[#1E2638] text-[#9B94BE] hover:text-[#FDFCF7] transition-colors cursor-pointer font-medium"
            >
              Start Fresh
            </button>
          )}
        </div>
      )}

      {/* Lunara Experience Flow Ribbon (Priority 4 Differentiator) */}
      <div className="mb-5 px-4 py-2.5 rounded-xl bg-[#0B0F19]/60 border border-[#1E2638] flex flex-wrap items-center justify-between text-xs text-[#9B94BE] gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] tracking-wide">
          <span className="text-[#E2C48D] font-medium flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2C48D] mr-1.5 animate-pulse" />
            Reflect
          </span>
          <span className="text-[#2E3A54]">→</span>
          <span className="text-[#9B94BE] hover:text-[#E2C48D] transition-colors" title="Light a Lantern: A short illumination of what seems most important in this conversation.">
            Light a Lantern
          </span>
          <span className="text-[#2E3A54]">→</span>
          <span className="text-[#9B94BE] hover:text-[#E2C48D] transition-colors" title="Crystallize into Memory: Distill this conversation into something you can revisit.">
            Crystallize
          </span>
          <span className="text-[#2E3A54]">→</span>
          <span className="text-[#9B94BE] hover:text-[#7AA8B8] transition-colors" title="Inner Sky: Your saved reflections, each becoming a permanent star.">
            Inner Sky
          </span>
        </div>
        <span className="text-[10px] text-[#9B94BE]/70 font-light hidden md:inline">
          Private, owner-bound reflection
        </span>
      </div>

      {/* Mode Selector */}
      <div className="mb-6">
        <ModeSelector
          currentMode={mode}
          onSelectMode={setMode}
          disabled={isResponding || conversation.length > 8}
        />
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          {failedMessage && (
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-red-900/60 hover:bg-red-800/80 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Conversation Stream */}
      <div className="flex-1 min-h-[300px] mb-6 space-y-4">
        {conversation.length === 0 ? (
          /* Intentional Sanctuary Empty State with Thought Starters */
          <div className="min-h-[280px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#1E2638] rounded-2xl bg-[#0B0F19]/40">
            <div className="w-11 h-11 rounded-full bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center text-[#E2C48D] mb-3 shadow-inner">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FDFCF7] mb-1.5 font-normal tracking-wide">
              What is asking for your attention today?
            </h3>
            <p className="text-xs sm:text-sm text-[#9B94BE] max-w-md font-light leading-relaxed mb-6">
              You don't need to know exactly what to say. Begin anywhere — a feeling, a decision, a quiet tension, or something small that stayed with you.
            </p>

            {/* Thought Starter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {[
                { label: "Something I'm carrying", prompt: "Something I've been carrying lately is " },
                { label: "A decision I'm circling", prompt: "I find myself circling a decision about " },
                { label: "Something I can't quite name", prompt: "There is a feeling I can't quite name, but " },
                { label: "A small thing that mattered", prompt: "A small moment that stayed with me today was " },
              ].map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(starter.prompt);
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                      textareaRef.current.setSelectionRange(starter.prompt.length, starter.prompt.length);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#161B2E] hover:bg-[#1F273D] border border-[#2E3A54] hover:border-[#E2C48D]/40 text-[#FDFCF7]/90 hover:text-[#E2C48D] text-xs font-light transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  ✦ {starter.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-2xl leading-relaxed text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#161B2E] border border-[#2E3A54] text-[#FDFCF7] shadow-sm rounded-br-sm font-light'
                    : 'bg-[#121724]/90 border border-[#1E2638] text-[#FDFCF7]/95 font-serif text-base sm:text-lg shadow-sm rounded-bl-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] tracking-wider uppercase mb-1.5 text-[#9B94BE]/70">
                  <span className="font-mono">{msg.role === 'user' ? 'You' : 'Lunara'}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}

        {/* Gemini Quiet Reflection Indicator */}
        {isResponding && (
          <div className="flex items-center space-x-3 text-xs text-[#E2C48D] px-4 py-3 rounded-2xl bg-[#121724]/90 border border-[#1E2638] max-w-xs shadow-sm backdrop-blur-sm">
            <div className="flex items-center space-x-1.5" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-[#E2C48D] animate-gemini-dot-1 inline-block" />
              <span className="w-2 h-2 rounded-full bg-[#B4A2E6] animate-gemini-dot-2 inline-block" />
              <span className="w-2 h-2 rounded-full bg-[#7AA8B8] animate-gemini-dot-3 inline-block" />
            </div>
            <span className="font-serif text-sm tracking-wide text-[#FDFCF7]/90 font-light">
              Lunara is reflecting quietly...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Active Session Tools: Attached Lantern badge & Crystallize CTA */}
      {conversation.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-3.5 rounded-xl bg-[#121724]/70 border border-[#1E2638]">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              {isLanternSavedToMemory && lantern ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#E2C48D]/15 border border-[#E2C48D]/40 text-xs text-[#E2C48D]">
                  <Flame className="w-3 h-3 fill-[#E2C48D]" />
                  <span>Lantern Attached to Reflection</span>
                </span>
              ) : (
                <button
                  id="btn-light-lantern"
                  type="button"
                  onClick={handleLightLantern}
                  disabled={isResponding || isLightingLantern}
                  className="px-3.5 py-1.5 rounded-full bg-[#161B2E] hover:bg-[#1E2638] border border-[#E2C48D]/40 text-[#E2C48D] text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isLightingLantern ? 'Kindling Lantern...' : 'Light a Lantern'}</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#9B94BE]/80 font-light">
              Illuminates the core tension or realization in this conversation.
            </p>
          </div>

          <div className="flex flex-col sm:items-end space-y-1">
            <button
              id="btn-crystallize-memory"
              type="button"
              onClick={handleCrystallize}
              disabled={isResponding || isCrystallizing}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F4F0E8] via-[#EBDDBF] to-[#E2C48D] text-[#0B0F19] text-xs font-semibold hover:opacity-95 transition-all shadow-[0_0_15px_-3px_rgba(226,196,141,0.3)] flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isCrystallizing ? (
                <>
                  <div className="flex items-center space-x-1" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19] animate-gemini-dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19] animate-gemini-dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19] animate-gemini-dot-3" />
                  </div>
                  <span>Distilling Memory...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#0B0F19]" />
                  <span>Crystallize into Memory</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-[#9B94BE]/80 font-light">
              Distills this reflection into a permanent star for your Inner Sky.
            </p>
          </div>
        </div>
      )}

      {/* Input Composer */}
      <div className="relative rounded-2xl bg-[#121724] border border-[#1E2638] focus-within:border-[#E2C48D]/60 focus-within:ring-1 focus-within:ring-[#E2C48D]/30 transition-all p-3 shadow-lg">
        <textarea
          ref={textareaRef}
          id="reflection-textarea"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isResponding}
          placeholder={
            conversation.length === 0
              ? 'What thought is asking for your attention today?'
              : 'Add another thought or respond to Lunara... (Press ⌘+Enter to send)'
          }
          maxLength={3000}
          rows={2}
          className="w-full bg-transparent text-sm text-[#FDFCF7] placeholder-[#9B94BE]/50 outline-none resize-none leading-relaxed px-1"
        />

        <div className="flex items-center justify-between pt-2 border-t border-[#1E2638]/60 mt-1">
          <span className="text-[11px] text-[#9B94BE]/50 font-mono">
            {inputText.length} / 3000
          </span>

          <div className="flex items-center space-x-2">
            <button
              id="btn-send-message"
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isResponding}
              className="px-4 py-2 rounded-xl bg-[#E2C48D] text-[#0B0F19] text-xs font-semibold hover:bg-[#ebd3a6] active:scale-[0.98] transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Share Thought</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LanternModal
        lantern={lantern}
        isOpen={isLanternModalOpen}
        onClose={() => setIsLanternModalOpen(false)}
        onSaveToMemory={handleSaveLanternToMemory}
        isSaved={isLanternSavedToMemory}
        isLoading={isLightingLantern}
      />

      {crystallizeData && (
        <CrystallizeReview
          memoryData={crystallizeData}
          lantern={isLanternSavedToMemory ? lantern : null}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onConfirmSave={handleConfirmSaveToSky}
          isSaving={isSavingToFirestore}
          saveError={saveError}
        />
      )}
    </div>
  );
};
