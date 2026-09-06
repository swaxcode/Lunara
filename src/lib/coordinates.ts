/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StarCoordinates } from '../types/reflection';

// Simple string hash producing 32-bit integer
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const hues: Array<StarCoordinates['spectralHue']> = ['gold', 'lavender', 'cyan', 'ivory'];

/**
 * Derives stable, deterministic star coordinates from document ID and creation timestamp.
 * Coordinates are bounded safely away from canvas borders (10% - 90%).
 */
export function deriveStarCoordinates(reflectionId: string, createdAt: number): StarCoordinates {
  const seed1 = hashString(`${reflectionId}-x-${createdAt}`);
  const seed2 = hashString(`${reflectionId}-y-${createdAt}`);
  const seed3 = hashString(`${reflectionId}-hue-${createdAt}`);
  const seed4 = hashString(`${reflectionId}-bright-${createdAt}`);

  // x between 10% and 90%
  const x = 10 + (seed1 % 8000) / 100;
  // y between 15% and 85%
  const y = 15 + (seed2 % 7000) / 100;
  // brightness between 0.70 and 1.00
  const brightness = 0.7 + (seed4 % 30) / 100;
  // spectral hue
  const spectralHue = hues[seed3 % hues.length];
  // size between 3.5px and 6.0px
  const size = 3.5 + (seed1 % 25) / 10;

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    brightness: Math.round(brightness * 100) / 100,
    spectralHue,
    size: Math.round(size * 10) / 10,
  };
}
