/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ReflectionMode = 'listen' | 'understand' | 'reframe' | 'brainstorm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LanternInsight {
  synthesis: string;
  savedAt?: number;
}

export interface OpenThread {
  exists: boolean;
  question: string;
  reason: string;
  status: 'open' | 'closed' | 'dismissed';
  updatedAt?: number;
}

export interface StarCoordinates {
  x: number; // 8% to 92%
  y: number; // 12% to 88%
  brightness: number; // 0.65 to 1.0
  spectralHue: 'gold' | 'lavender' | 'cyan' | 'ivory';
  size: number; // 3 to 6 px
}

export interface ConstellationMemoryData {
  title: string;
  summary: string;
  themes: string[];
  openThread?: {
    exists: boolean;
    question: string;
    reason: string;
  };
}

export interface ReflectionDocument {
  id: string;
  userId: string;
  mode: ReflectionMode;
  title: string;
  summary: string;
  themes: string[];
  conversation: Array<{
    role: 'user' | 'model';
    text: string;
    timestamp: number;
  }>;
  lantern?: LanternInsight | null;
  openThread?: OpenThread | null;
  starCoordinates: StarCoordinates;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}
