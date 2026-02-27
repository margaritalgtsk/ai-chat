import { log } from '../observability/logger';
import type { CallLLM } from '../services/llm/callLLM';
import { agentReasoningPrompt } from './prompts/reasoning';
import type { Message } from '../types';
import { searchTool } from './tools/searchTool';
import { extractJSON } from './utils';
import { MAX_SEARCHES, MAX_STEPS } from './constants';
import {
  AgentDecisionSchema,
  type AgentDecision,
  type AgentResult,
  type AgentStep,
} from './types';
import { buildFinalPrompt } from './prompts/buildFinalPrompt';

export async function runAgent({
  userInput,
  history,
  callLLM,
  signal,
  correlationId,
}: {
  userInput: string;
  history?: Message[];
  callLLM: CallLLM;
  signal?: AbortSignal;
  correlationId?: string;
}): Promise<AgentResult> {
  log.info('Agent started', { correlationId });

  const agentSteps: AgentStep[] = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    log.info('Agent steps', { correlationId, agentSteps: [...agentSteps] });

    const searchCount = agentSteps.filter(
      (s) => s.action.type === 'search'
    ).length;

    if (searchCount >= MAX_SEARCHES) {
      log.info('Search budget reached → forcing final answer', {
        correlationId,
        searchCount,
      });

      const final = await callLLM({
        text: buildFinalPrompt(agentSteps, userInput),
        signal,
        correlationId,
      });
      return { type: 'final', content: final };
    }

    const reasoningPrompt = agentReasoningPrompt({
      userInput,
      history,
      agentSteps,
    });
    log.info('Generating reasoning prompt', {
      correlationId,
      prompt: reasoningPrompt,
    });

    const reasoningCall = await callLLM({
      text: reasoningPrompt,
      signal,
      correlationId,
    });
    log.info('Reasoning call completed', { correlationId });

    const jsonResultCall = extractJSON(reasoningCall);
    if (!jsonResultCall) {
      log.warn('Failed to extract JSON from agent reasoning output', {
        correlationId,
        reasoningRaw: reasoningCall,
      });
      return {
        type: 'error',
        content: 'Sorry, something went wrong.',
      };
    }

    let decision: AgentDecision;

    try {
      const parsed = AgentDecisionSchema.safeParse(JSON.parse(jsonResultCall));
      if (!parsed.success) {
        log.warn('Invalid agent decision structure', {
          correlationId,
          errors: parsed.error.format(),
        });
        return {
          type: 'error',
          content: 'Sorry, something went wrong.',
        };
      }
      decision = parsed.data;
      log.info('Parsed agent decision successfully', {
        correlationId,
        decision,
      });
    } catch (e) {
      log.warn('Failed to parse agent decision', { correlationId, error: e });
      return {
        type: 'error',
        content: 'Sorry, something went wrong.',
      };
    }

    if (decision.action.type === 'search') {
      const previousQueries = agentSteps
        .filter((s) => s.action.type === 'search')
        .map((s) => s.action.query);

      if (previousQueries.includes(decision.action.query)) {
        agentSteps.push({
          thought: decision.thought,
          action: decision.action,
          observations:
            'Search skipped: query already executed. Choose respond or new query.',
        });
        continue;
      }

      const result = await searchTool(decision.action.query);

      agentSteps.push({
        thought: decision.thought,
        action: decision.action,
        observations:
          result.success && result.result
            ? result.result
            : 'No relevant results found.',
      });
      continue;
    }

    if (decision.action.type === 'respond') {
      const final = await callLLM({
        text: buildFinalPrompt(agentSteps, userInput),
        signal,
        correlationId,
      });
      return { type: 'final', content: final };
    }
  }

  log.warn('Agent stopped: max steps reached without final response', {
    correlationId,
    maxSteps: MAX_STEPS,
  });

  return {
    type: 'error',
    content: `I could not complete the request in time. Please try again with more specific query or ask for less information.`,
  };
}
