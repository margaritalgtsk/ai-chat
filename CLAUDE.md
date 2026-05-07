# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Run everything (from repo root)

```bash
npm install      # Install concurrently (first time only)
npm run dev      # Start client + server together
```

### Client (React + TypeScript + Vite)

```bash
cd client
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Type-check (tsc -b) and build for production
npm run lint     # Run ESLint (flat config, v9)
npm run preview  # Preview production build
npm run test     # Run Jest tests
npx prettier --write src/   # Format code
```

### Server (Node.js + Express)

```bash
cd server
node index.js    # Start backend server (http://localhost:3001)
```

### Testing

Jest 30 + ts-jest + jsdom are configured. One test file exists: `client/src/agent/__tests__/agentRunner.test.ts` (13 test suites covering the agent loop, critic, tools, memory, abort signals). No component or E2E tests yet.

```bash
cd client && npm test              # Run all tests
cd client && npm test -- --watch   # Watch mode
```

## Architecture Overview

Full-stack AI chat application built around a client-side **ReAct agent** (Reasoning + Acting loop).

### Stack

- **Frontend**: React 19 + TypeScript 5.9 (strict mode) + Redux Toolkit, built with Vite 7
- **Backend**: Express 5 serving `POST /api/chat` and `POST /api/search` endpoints via Server-Sent Events
- **LLM**: Groq (`llama-3.3-70b-versatile`) in `server/index.js`; alternatives in `index-open-ai.js`, `index-hf-ai.js`
- **Web Search**: Tavily API, proxied through the server (`/api/search`)

### Agent System (`client/src/agent/`)

The core of the app. Runs entirely client-side in a ReAct loop:

1. **`agentRunner.ts`** — Main loop. Each iteration: call LLM with reasoning prompt → parse decision → execute tool or finalize. Runs a **critic** pass before finalizing to evaluate response quality.
2. **`actions/parseDecision.ts`** — Parses raw LLM output into a typed `AgentAction` (`search`, `webSearch`, `time`, `memory`, `respond`, or `error`). Uses Zod schema (`agent/schemas/`).
3. **`tools/toolRegistry.ts`** — Registers available tools: `knowledgeSearchTool`, `webSearchTool`, `timeTool`, `memoryTool`.
4. **`tools/toolExecution.ts`** — Dispatches tool calls to registered implementations.
5. **`tools/knowledgeBase.ts`** + **`knowledgeSearch.ts`** — Static knowledge base with scored multi-match search.
6. **`tools/webSearchTool.ts`** — Calls `POST /api/search` (Tavily-powered) for live web results.
7. **`memory/memoryStore.ts`** — Persists agent memory to `localStorage`; populated via `memoryCapturePrompt` after each conversation.
8. **`prompts/`** — `reasoning.ts`, `criticPrompt.ts`, `finalPrompt.ts`, `memoryCapturePrompt.ts`.
9. **`constants.ts`** — `MAX_STEPS`, `MAX_SEARCHES`, `MAX_CRITIC_STEPS` guard against infinite loops.

### Chat Feature (`client/src/features/chat/`)

Redux-managed chat state with streaming support:

- **`chatSlice.ts`** — State for sessions and messages; handles per-message streaming updates, status (including real-time agent step labels), and errors.
- **`chatThunks.ts`** — `sendMessageThunk`: main async thunk. Handles retry with exponential backoff and abort signal plumbing.
- **`chatStreamResponse.ts`** — Chooses real agent or mock stream (`VITE_MOCK_CHAT_STREAM` env var), feeds streamed tokens + status updates into Redux.
- **`chatListeners.ts`** — Redux listener middleware for side effects (persisting chat to `localStorage`).
- **`chatAbortControllers.ts`** — Tracks `AbortController` instances so in-flight requests can be cancelled.

### LLM Service (`client/src/services/llm/callLLM.ts`)

Sends `POST /api/chat` to the backend and returns an async iterator of streamed text chunks. Used by the agent runner for each reasoning step. Base URL defaults to `http://localhost:3001` if `VITE_API_URL` is not set.

### State & Persistence

- Redux store (`store/store.ts`) with chat reducer + listener middleware.
- `localStorage` is used for both chat history and agent memory (no server-side persistence).
- `storage.ts` — helpers for serializing/deserializing chat sessions.

### Observability

- `observability/logger.ts` — Simple console-based logger with `info`, `warn`, `error` levels.

## Key Files Reference

| File                                       | Purpose                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `client/src/agent/agentRunner.ts`          | Main ReAct + critic loop                                               |
| `client/src/agent/constants.ts`            | `MAX_STEPS=3`, `MAX_SEARCHES=3`, `MAX_CRITIC_STEPS=2`                  |
| `client/src/features/chat/chatSlice.ts`    | Redux state shape                                                      |
| `client/src/features/chat/chatThunks.ts`   | `sendMessageThunk` with retry                                          |
| `client/src/types.ts`                      | Core types: `Message`, `ChatSession`, `MessageStatus`, `ChatErrorType` |
| `client/src/shared/styles/Chat.module.css` | Main UI styles (CSS variables, responsive)                             |
| `server/index.js`                          | Express server, Groq + Tavily integration                              |

## Environment Variables

### `client/.env`

```
VITE_MOCK_CHAT_STREAM=true    # Bypass real agent, return mock response (dev only)
VITE_API_URL=http://localhost:3001  # Backend URL (optional, defaults to localhost:3001)
```

### `server/.env`

```
GROQ_API_KEY=
TAVILY_API_KEY=
OPENAI_API_KEY=    # Only used by index-open-ai.js
HF_API_KEY=        # Only used by index-hf-ai.js
```

## TypeScript

Strict mode is fully enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`. Do not add `any` casts or relax these settings.
