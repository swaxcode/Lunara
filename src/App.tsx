/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { LandingHero } from './components/auth/LandingHero';
import { ReflectionWorkspace, ResumedThreadInfo } from './components/reflection/ReflectionWorkspace';
import { InnerSkyCanvas } from './components/sky/InnerSkyCanvas';
import { MemoryDetailModal } from './components/memory/MemoryDetailModal';
import { NightSkyBackdrop } from './components/layout/NightSkyBackdrop';
import { ReflectionDocument, OpenThread } from './types/reflection';
import { db } from './lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Moon, Sparkles } from 'lucide-react';

function LunaraMain() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'reflect' | 'sky'>('reflect');
  const [reflections, setReflections] = useState<ReflectionDocument[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionDocument | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [resumedThread, setResumedThread] = useState<ResumedThreadInfo | null>(null);

  // Firestore real-time listener scoped to the authenticated user's reflections
  useEffect(() => {
    if (!user) {
      setReflections([]);
      return;
    }

    try {
      const userReflectionsRef = collection(db, 'users', user.uid, 'reflections');
      const q = query(userReflectionsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs: ReflectionDocument[] = [];
          snapshot.forEach((d) => {
            docs.push(d.data() as ReflectionDocument);
          });
          setReflections(docs);
        },
        (error) => {
          console.error('Firestore listener error:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to setup Firestore listener:', err);
    }
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-[#FDFCF7]">
        <div className="w-12 h-12 rounded-full bg-[#161B2E] border border-[#2E3A54] flex items-center justify-center text-[#E2C48D] animate-spin mb-4">
          <Moon className="w-6 h-6" />
        </div>
        <p className="font-serif text-lg tracking-widest text-[#E2C48D] animate-pulse">
          LUNARA
        </p>
        <p className="text-xs text-[#9B94BE] font-light mt-1">
          Opening your inner sanctuary...
        </p>
      </div>
    );
  }

  // Unauthenticated landing page
  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#070A12] text-[#FDFCF7]">
        <NightSkyBackdrop />
        <header className="border-b border-[#1E2638]/40 bg-[#0B0F19]/60 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#161B2E] via-[#2A2B45] to-[#E2C48D]/20 border border-[#E2C48D]/40 flex items-center justify-center">
                <Moon className="w-4 h-4 text-[#E2C48D]" />
              </div>
              <span className="font-serif text-xl tracking-wider text-[#FDFCF7] font-medium">
                LUNARA
              </span>
            </div>
            <div className="text-xs text-[#9B94BE] tracking-widest uppercase font-light">
              Your Inner Sky
            </div>
          </div>
        </header>
        <LandingHero />
      </div>
    );
  }

  // Handle open thread update
  const handleUpdateOpenThread = async (reflectionId: string, updatedThread: OpenThread | null) => {
    if (!user) return;
    try {
      const refDoc = doc(db, 'users', user.uid, 'reflections', reflectionId);
      await updateDoc(refDoc, {
        openThread: updatedThread,
        updatedAt: Date.now(),
      });

      // Update active modal copy
      if (selectedReflection && selectedReflection.id === reflectionId) {
        setSelectedReflection({
          ...selectedReflection,
          openThread: updatedThread,
        });
      }
    } catch (err) {
      console.error('Error updating open thread:', err);
    }
  };

  // Handle delete reflection
  const handleDeleteReflection = async (reflectionId: string) => {
    if (!user) return;
    try {
      const refDoc = doc(db, 'users', user.uid, 'reflections', reflectionId);
      await deleteDoc(refDoc);
    } catch (err) {
      console.error('Error deleting reflection:', err);
    }
  };

  const handleSelectReflection = (ref: ReflectionDocument) => {
    setSelectedReflection(ref);
    setIsDetailModalOpen(true);
  };

  const handleRevisitThread = (reflection: ReflectionDocument) => {
    if (!reflection.openThread?.question) return;

    // Convert saved reflection conversation into chat turns
    const existingTurns = (reflection.conversation || []).map((msg, idx) => ({
      id: `resumed-${idx}-${Date.now()}`,
      role: msg.role,
      text: msg.text,
      timestamp: msg.timestamp || Date.now(),
    }));

    setResumedThread({
      reflectionId: reflection.id,
      mode: reflection.mode,
      title: reflection.title,
      question: reflection.openThread.question,
      conversation: existingTurns,
    });

    setCurrentTab('reflect');
  };

  return (
    <div className="relative min-h-screen bg-[#070A12] text-[#FDFCF7] flex flex-col selection:bg-[#9B94BE]/30 selection:text-[#FDFCF7]">
      <NightSkyBackdrop />
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        savedCount={reflections.length}
      />

      {/* Main Workspace / Views */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'reflect' ? (
          <ReflectionWorkspace
            onReflectionSaved={() => {
              // Clear any resumed thread and switch to sky
              setResumedThread(null);
              setCurrentTab('sky');
            }}
            resumedThread={resumedThread}
            onClearResumedThread={() => setResumedThread(null)}
          />
        ) : (
          <InnerSkyCanvas
            reflections={reflections}
            onSelectReflection={handleSelectReflection}
            onNavigateToReflect={() => setCurrentTab('reflect')}
          />
        )}
      </main>

      {/* Memory Detail Reader Modal */}
      <MemoryDetailModal
        reflection={selectedReflection}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReflection(null);
        }}
        onUpdateOpenThread={handleUpdateOpenThread}
        onDeleteReflection={handleDeleteReflection}
        onRevisitThread={handleRevisitThread}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LunaraMain />
    </AuthProvider>
  );
}
