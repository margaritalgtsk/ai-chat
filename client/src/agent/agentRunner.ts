import { log } from '../observability/logger';
import type { CallLLM } from '../services/llm/callLLM';
import { agentReasoningPrompt } from './prompts/reasoning';
import { agentResponsePrompt } from './prompts/response';
import type { AgentDecision } from './types';

export async function runAgent({
  userInput,
  callLLM,
  signal,
  correlationId,
}: {
  userInput: string;
  callLLM: CallLLM;
  signal?: AbortSignal;
  correlationId?: string;
}) {
  log.info('Agent started', { correlationId });

  const reasoningRaw = await callLLM({
    text: agentReasoningPrompt(userInput),
    signal,
    correlationId,
  });

  log.info('Agent reasoning completed', { correlationId, reasoningRaw });

  let decision: AgentDecision;

  try {
    decision = JSON.parse(reasoningRaw);
  } catch (e) {
    log.warn('Failed to parse agent reasoning output', {
      correlationId,
      error: e,
    });
    return {
      type: 'error',
      content: 'Sorry, something went wrong.',
    };
  }

  /*   if (decision.intent === 'needs_clarification') {
    return {
      type: 'clarification',
      content: decision.reason || 'Could you please clarify your request?',
    };
  } */

  const responsePrompt = agentResponsePrompt(userInput, decision.intent);
  log.info('Generating prompt', {
    correlationId,
    prompt: responsePrompt,
  });

  const response = await callLLM({
    text: responsePrompt,
    signal,
    correlationId,
  });
  log.info('Generated response, agent completed', { correlationId, response });

  return {
    type: 'final',
    content: response,
  };
}
