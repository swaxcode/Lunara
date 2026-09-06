# Lunara — Your Inner Sky

**Lunara** is an intimate, private, authenticated AI reflection companion designed to help people turn fleeting thoughts into quiet understanding. Built with an editorial night-garden aesthetic, Lunara lets users converse with Gemini across four dedicated reflection modes, light signature "Lanterns" of illuminated insight, and preserve memories as permanent, deterministic stars in their personal **Inner Sky**.

> **Google Cloud Challenge Verification Label:**  
> `dev-tutorial=cloud-run-ai-challenge`

---

## Table of Contents
1. [Product Concept](#product-concept)
2. [Core Architecture & Trust Boundaries](#core-architecture--trust-boundaries)
3. [Key Features](#key-features)
   - [The Four Reflection Modes](#the-four-reflection-modes)
   - [Light a Lantern](#light-a-lantern)
   - [Constellation Memory Crystallization](#constellation-memory-crystallization)
   - [The Inner Sky](#the-inner-sky)
4. [Security & Threat Model](#security--threat-model)
   - [Zero-Trust Boundary](#zero-trust-boundary)
   - [Firestore User Isolation & Rules](#firestore-user-isolation--rules)
   - [Prompt Injection Defense](#prompt-injection-defense)
   - [Secret Management](#secret-management)
5. [Data Architecture](#data-architecture)
6. [Local Development](#local-development)
7. [Cloud Run Deployment](#cloud-run-deployment)
8. [Testing & Verification](#testing--verification)
9. [Troubleshooting](#troubleshooting)

---

## Product Concept

Lunara is built around the core journey:
```
WRITE → CONVERSE → DISCOVER → CAPTURE → REVISIT
```
Unlike generic AI chatbots or clinical wellness apps, Lunara acts as a contemplative sanctuary. Gemini is framed not as an authority or therapist, but as an emotionally intelligent mirror that speaks with calm presence, gentle uncertainty, and thoughtful conciseness.

---

## Core Architecture & Trust Boundaries

Lunara follows a strict full-stack separation of concerns:

```
┌─────────────────────────┐         Firebase ID Token         ┌─────────────────────────┐
│     CLIENT (Browser)    │ ────────────────────────────────> │     BACKEND (Express)   │
│  • React 19 + Vite      │                                   │  • Port 3000 (0.0.0.0)  │
│  • Tailwind CSS         │ <──────────────────────────────── │  • Firebase Admin Auth  │
│  • Firebase Client Auth │           Authorized Data         │  • Input Validation     │
└───────────┬─────────────┘                                   └────────────┬────────────┘
            │                                                              │
            │ Direct Owner-Bound Access                                    │ Server-Side Only
            ▼                                                              ▼
┌─────────────────────────┐                                   ┌─────────────────────────┐
│     CLOUD FIRESTORE     │                                   │       GEMINI API        │
│  /users/{uid}/...       │                                   │  • @google/genai SDK    │
│  • Owner-bound rules    │                                   │  • Fallback Resilience  │
│  • Default Deny         │                                   │  • Structured JSON mode │
└─────────────────────────┘                                   └─────────────────────────┘
```

1. **Client Tier**: React 19 single-page application communicating with Firebase Authentication (Google Sign-In) and Firestore for real-time reflection retrieval.
2. **Backend Tier**: Express on Node.js. Intercepts all AI reflection endpoints, validates payloads, verifies Firebase ID tokens server-side with Firebase Admin, derives the authenticated UID, and contacts the Gemini API.
3. **AI Tier**: `@google/genai` TypeScript SDK using `gemini-3.6-flash` (with automated retry and error resilience). Secrets never reach the client.

---

## Key Features

### The Four Reflection Modes
- **Listen**: Spacious, compassionate room to express without rush to solve, fix, or lecture.
- **Understand**: Illuminates underlying currents, recurring patterns, and internal friction without stating interpretations as absolute facts.
- **Reframe**: Offers grounded alternative perspectives without toxic positivity or dismissing the user's experience.
- **Brainstorm**: Generates practical ideas, options, and gentle experiments when exploring pathways forward.

### Light a Lantern
During any active reflection, users can choose **"Light a Lantern"**. Gemini analyzes the conversation and produces a concise 1–2 sentence synthesis identifying the pivotal tension, contradiction, or emergent realization. The user can dismiss it or attach it to their session memory.

### Constellation Memory Crystallization
When concluding a session, **"Crystallize into Memory"** invokes Gemini with a structured JSON schema to distill the conversation into:
- An evocative 3–6 word Title
- A warm, accurate 2–3 sentence Summary
- 2–5 thematic keywords
- An optional **Open Thread** (only if the conversation genuinely left an unresolved inquiry)

The user reviews and edits the memory before confirming **"Save to Inner Sky"**. Reflections are only marked saved once Firestore confirms the write.

### The Inner Sky
Saved reflections are visually mapped onto an immersive celestial canvas as stars.
- **Deterministic Coordinates**: Position `(x, y)`, brightness, and spectral hue are calculated deterministically using a document hash. A star always stays in the exact same location across sessions and reloads.
- **Real Data Only**: No fake stars or fabricated metrics. If the user has no reflections, a peaceful empty state is displayed: *"Your sky begins with your first thought."*
- **Interactive Starlight**: Clicking any star opens the editorial reader displaying the reflection summary, themes, saved Lantern, Open Thread status manager (Revisit, Close, Dismiss), and original conversation logs.

---

## Security & Threat Model

### Zero-Trust Boundary
- **Never Trust Client-Provided UIDs**: Backend API endpoints derive identity exclusively from `getAdminAuth().verifyIdToken(token)`.
- **Default Deny Firestore Rules**: Unspecified collection reads or writes are explicitly disallowed.
- **Owner-Bound Scoping**: All reflections live under `/users/{uid}/reflections/{reflectionId}`. Rules check `request.auth != null && request.auth.uid == userId`.

### Firestore Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /users/{userId}/reflections/{reflectionId} {
      function isOwner() {
        return request.auth != null && request.auth.uid == userId;
      }
      allow read, delete: if isOwner();
      allow create: if isOwner() && request.resource.data.userId == userId;
      allow update: if isOwner() && request.resource.data.userId == resource.data.userId;
    }
  }
}
```

### Prompt Injection Defense
User messages are untrusted inputs. The system instructions explicitly enforce that all user inputs are subjective journal thoughts, and any meta-commands attempting to override system behavior, reveal hidden prompts, or exfiltrate secrets are disregarded.

### Secret Management
- `GEMINI_API_KEY` is strictly managed server-side.
- In Cloud Run, secrets are injected via Google Cloud Secret Manager environment mounts.
- No `VITE_` prefix is ever used for AI credentials.

---

## Data Architecture

Document path: `/users/{uid}/reflections/{reflectionId}`

```typescript
interface ReflectionDocument {
  id: string;
  userId: string;
  mode: 'listen' | 'understand' | 'reframe' | 'brainstorm';
  title: string;
  summary: string;
  themes: string[];
  conversation: Array<{
    role: 'user' | 'model';
    text: string;
    timestamp: number;
  }>;
  lantern?: {
    synthesis: string;
    savedAt?: number;
  } | null;
  openThread?: {
    exists: boolean;
    question: string;
    reason: string;
    status: 'open' | 'closed' | 'dismissed';
    updatedAt?: number;
  } | null;
  starCoordinates: {
    x: number; // 10% - 90%
    y: number; // 15% - 85%
    brightness: number;
    spectralHue: 'gold' | 'lavender' | 'cyan' | 'ivory';
    size: number;
  };
  createdAt: number;
  updatedAt: number;
}
```

---

## Local Development

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   ```
4. Start the development server (Express + Vite on Port 3000):
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

---

## Cloud Run Deployment

Lunara is bundled into a single deployable container:
- **Build**: `npm run build` compiles Vite assets to `dist/` and bundles `server.ts` to `dist/server.cjs`.
- **Start**: `npm start` runs `node dist/server.cjs` binding to `0.0.0.0:3000`.

### Deploy Command
```bash
gcloud run deploy lunara \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --labels dev-tutorial=cloud-run-ai-challenge
```

---

## Testing & Verification

- **TypeScript & Linting**:
  ```bash
  npm run lint
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Security Check**:
  - `curl -X POST http://localhost:3000/api/reflection/respond` (Returns 401: Authentication required)
  - `curl -X POST http://localhost:3000/api/reflection/lantern` (Returns 401: Authentication required)
  - `curl -X POST http://localhost:3000/api/reflection/crystallize` (Returns 401: Authentication required)

---

## Troubleshooting

- **Authentication Popup Blocked**: In browser preview environments, ensure popups are allowed for Google Sign-In or open the app in a dedicated tab.
- **Firestore Permission Denied**: Ensure `firestore.rules` has been deployed using `deploy_firebase` and the user is authenticated.
- **Missing Gemini Key**: Verify that `GEMINI_API_KEY` is configured in `.env` or Secret Manager.
