# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Client (React + TypeScript + Vite)
```bash
cd client
npm run dev      # Start dev server
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server (Node.js + Express)
```bash
cd server
node index.js    # Start the backend server
```

There are no automated tests configured in this project.

## Architecture Overview

This is a full-stack AI chat application built around a client-side **ReAct agent** (Reasoning + Acting loop).

### Stack
- **Frontend**: React + TypeScript + Redux Toolkit, built with Vite
- **Backend**: Express.js serving a single `POST /api/chat` endpoint that proxies to Groq (llama-3.3-70b-versatile) via Server-Sent Events
- **LLM Providers**: `server/index.js` uses Groq; alternatives exist in `server/index-open-ai.js` and `server/index-hf-ai.js`

### Agent System (`client/src/agent/`)

The core of the app. The agent runs entirely client-side in a loop:

1. **`agentRunner.ts`** — Main ReAct loop. Each iteration: calls the LLM with reasoning prompt → parses the decision → executes a tool or finalizes. Runs a **critic** pass before finalizing to evaluate response quality.
2. **`actions/parseDecision.ts`** — Parses raw LLM output into a typed `AgentAction` (search, time, memory, respond, or error).
3. **`tools/toolRegistry.ts`** — Registers available tools: `searchTool`, `timeTool`, `memoryTool`.
4. **`tools/toolExecution.ts`** — Dispatches tool calls to the registered tool implementations.
5. **`memory/memoryStore.ts`** — Persists agent memory to `localStorage`; populated via `memoryCapturePrompt` after each conversation.
6. **`prompts/`** — Contains `reasoning.ts` (main ReAct prompt), `criticPrompt.ts`, `finalPrompt.ts`, `memoryCapturePrompt.ts`.
7. **`constants.ts`** — `MAX_STEPS`, `MAX_SEARCHES`, `MAX_CRITIC_STEPS` guard against infinite loops.

### Chat Feature (`client/src/features/chat/`)

Redux-managed chat state with streaming support:

- **`chatSlice.ts`** — State for sessions and messages; handles per-message streaming updates, status, and errors.
- **`chatThunks.ts`** — `sendMessageThunk`: the main async thunk. Handles retry with exponential backoff and abort signal plumbing.
- **`chatStreamResponse.ts`** — Decides whether to use the real agent or mock stream (`VITE_MOCK_CHAT_STREAM` env var), then feeds streamed tokens into Redux.
- **`chatListeners.ts`** — Redux listener middleware for side effects (e.g., persisting chat to `localStorage`).
- **`chatAbortControllers.ts`** — Tracks `AbortController` instances so in-flight requests can be cancelled.

### LLM Service (`client/src/services/llm/callLLM.ts`)

Sends `POST /api/chat` to the backend and returns an async iterator of streamed text chunks. Used directly by the agent runner for each reasoning step.

### State & Persistence

- Redux store (`store/store.ts`) with chat reducer + listener middleware.
- `localStorage` is used for both chat history and agent memory (no server-side persistence).

### Environment Variables

- `client/.env`: `VITE_MOCK_CHAT_STREAM` — set to `true` to bypass the real agent and return a mock response.
- `server/.env`: `GROQ_API_KEY`, `OPENAI_API_KEY`, `HF_API_KEY`.
