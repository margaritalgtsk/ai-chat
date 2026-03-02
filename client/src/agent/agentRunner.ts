import type { CallLLM } from '../services/llm/callLLM';
import { agentReasoningPrompt } from './prompts/reasoning';
import type { Message } from '../types';
import { MAX_SEARCHES, MAX_STEPS } from './constants';
import { type AgentResult, type AgentStep } from './types';
import { parseDecision } from './actions/parseDecision';
import { handleSearch } from './actions/handleSearch';
import { finalize } from './actions/finalize';
import { agentError } from './utils/error';
import { log } from '../observability/logger';

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
  log.info('Starting agent with input', { correlationId, userInput });

  const agentContext = {
    userInput,
    callLLM,
    signal,
    correlationId,
  };
  const agentSteps: AgentStep[] = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    const searchCount = agentSteps.filter(
      (s) => s.action.type === 'search'
    ).length;

    if (searchCount >= MAX_SEARCHES) {
      return finalize({ agentSteps, agentContext });
    }

    const reasoningPrompt = agentReasoningPrompt({
      userInput,
      history,
      agentSteps,
    });
    log.info('Generated reasoning prompt', { correlationId, reasoningPrompt });

    const reasoningCall = await callLLM({
      text: reasoningPrompt,
      signal,
      correlationId,
    });

    const decision = parseDecision(reasoningCall);
    if (!decision) return agentError();

    log.info('Parsed decision from LLM', { correlationId, decision });

    if (decision.action.type === 'search') {
      const result = await handleSearch({
        agentSteps,
        action: decision.action,
        thought: decision.thought,
      });
      agentSteps.push(result);
    }

    if (decision.action.type === 'respond') {
      return finalize({ agentSteps, agentContext });
    }
  }
  log.warn('Agent reached maximum steps without finalizing', { correlationId });
  return {
    type: 'error',
    content: `I could not complete the request in time. Please try again with more specific query or ask for less information.`,
  };
}
