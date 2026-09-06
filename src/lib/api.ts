/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReflectionMode, ConstellationMemoryData } from '../types/reflection';

interface ApiRequestOptions {
  token: string;
  endpoint: string;
  body: any;
}

async function authenticatedPost<T>({ token, endpoint, body }: ApiRequestOptions): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = `Server returned status ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Send a message turn to Gemini with selected mode
 */
export async function sendReflectionTurn(
  token: string,
  mode: ReflectionMode,
  conversation: Array<{ role: 'user' | 'model'; text: string }>
): Promise<{ text: string; mode: ReflectionMode }> {
  return authenticatedPost<{ text: string; mode: ReflectionMode }>({
    token,
    endpoint: '/api/reflection/respond',
    body: { mode, conversation },
  });
}

/**
 * Request a Lantern synthesis of the conversation
 */
export async function lightLantern(
  token: string,
  conversation: Array<{ role: 'user' | 'model'; text: string }>
): Promise<{ synthesis: string }> {
  return authenticatedPost<{ synthesis: string }>({
    token,
    endpoint: '/api/reflection/lantern',
    body: { conversation },
  });
}

/**
 * Crystallize conversation into structured Constellation Memory JSON
 */
export async function crystallizeMemory(
  token: string,
  conversation: Array<{ role: 'user' | 'model'; text: string }>,
  mode: ReflectionMode,
  lantern?: string
): Promise<ConstellationMemoryData> {
  return authenticatedPost<ConstellationMemoryData>({
    token,
    endpoint: '/api/reflection/crystallize',
    body: { conversation, mode, lantern },
  });
}
