import { log } from '../../observability/logger';
import { finalPrompt } from '../prompts/finalPrompt';
import type { AgentContext, AgentStep } from '../types';

export const finalize = async ({
  agentSteps,
  agentContext,
}: {
  agentSteps: AgentStep[];
  agentContext: AgentContext;
}): Promise<{ type: 'final'; content: string }> => {
  const { userInput, callLLM, signal, correlationId } = agentContext;

  const final = await callLLM({
    text: finalPrompt(agentSteps, userInput),
    signal,
    correlationId,
  });
  log.info('Final response generated', { correlationId, final });
  return { type: 'final', content: final };
};
