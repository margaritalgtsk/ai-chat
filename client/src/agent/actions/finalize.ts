import { log } from '../../observability/logger';
import type { Message } from '../../types';
import { finalPrompt } from '../prompts/finalPrompt';
import type { AgentContext, AgentStep } from '../types';

export const finalize = async ({
  agentSteps,
  agentContext,
  history,
}: {
  agentSteps: AgentStep[];
  agentContext: AgentContext;
  history?: Message[];
}): Promise<{ type: 'final'; content: string }> => {
  const { userInput, callLLM, signal, correlationId } = agentContext;

  const final = await callLLM({
    text: finalPrompt({ agentSteps, userInput, history }),
    signal,
    correlationId,
  });
  log.info('Final response generated', { correlationId, final });
  return { type: 'final', content: final };
};
