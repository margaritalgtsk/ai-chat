import type { CallLLM } from '../services/llm/callLLM';
import { agentReasoningPrompt } from './prompts/reasoning';
import type { Message } from '../types';
import { MAX_SEARCHES, MAX_STEPS } from './constants';
import { type AgentResult, type AgentStep } from './types';
import { parseDecision } from './actions/parseDecision';
import { finalize } from './actions/finalize';
import { agentError } from './utils/error';
import { log } from '../observability/logger';
import { toolExecution } from './tools/toolExecution';
import { memoryStore } from './memory/memoryStore';
import { memoryCapture } from './actions/memoryCapture';
import { criticPrompt } from './prompts/criticPrompt';
import { parseCritic } from './actions/parseCritic';

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
    //memory: new MemoryStore(),
  };
  let postCriticSteps = 0;
  const agentSteps: AgentStep[] = [];

  type FinalizeOutcome = { done: true; result: AgentResult } | { done: false };

  async function handleFinalize(): Promise<FinalizeOutcome> {
    const final = await finalize({ agentSteps, agentContext, history });

    if (postCriticSteps === 0) {
      const criticRaw = await callLLM({
        text: criticPrompt({
          userInput,
          finalAnswer: final.content,
          agentSteps,
        }),
        signal,
        correlationId,
      });

      const critic = parseCritic(criticRaw);
      log.info('Critic feedback', { correlationId, critic });
      if (critic.retry) {
        postCriticSteps++;
        agentSteps.push({
          thought: 'Critic feedback received',
          action: { type: 'respond' }, //TODO: make field action optional
          observations: critic.feedback,
        });
        return { done: false };
      }
    }

    const memory = await memoryCapture({
      userInput,
      signal,
      correlationId,
      callLLM,
    });
    if (memory) {
      memoryStore.add(memory.key, memory.value);
    }
    log.info('memoryStore', { correlationId, memory: memoryStore.getAll() });
    return { done: true, result: final };
  }

  for (let step = 0; step < MAX_STEPS; step++) {
    log.info('Agent step', { correlationId, step, ...agentSteps });
    log.info('Current memory store', {
      correlationId,
      memory: memoryStore.getAll(),
    });

    const searchCount = agentSteps.filter(
      (s) =>
        s.action.type === 'knowledgeSearch' || s.action.type === 'webSearch'
    ).length;

    if (searchCount >= MAX_SEARCHES && postCriticSteps === 0) {
      const outcome = await handleFinalize();
      if (!outcome.done) continue;
      return outcome.result;
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
    log.info('LLM decision', { correlationId, decision });
    if (!decision) return agentError();

    if (decision.action.type === 'respond') {
      const outcome = await handleFinalize();
      if (!outcome.done) continue;
      return outcome.result;
    }

    if (
      decision.action.type === 'knowledgeSearch' ||
      decision.action.type === 'webSearch'
    ) {
      const previousQueries = agentSteps
        .filter(
          (s) =>
            s.action.type === 'knowledgeSearch' || s.action.type === 'webSearch'
        )
        .map((s) => s.action.query);

      if (
        previousQueries.includes(decision.action.query) &&
        postCriticSteps === 0
      ) {
        agentSteps.push({
          thought: decision.thought,
          action: decision.action,
          observations:
            'Search skipped: query already executed. Choose respond or new query.',
        });
        continue;
      }
    }

    const toolResult = await toolExecution(decision.action);
    if (toolResult.success) {
      agentSteps.push({
        thought: decision.thought,
        action: decision.action,
        observations: toolResult.result ?? 'Tool failed',
      });
      continue;
    }
  }
  log.warn('Agent reached maximum steps without finalizing', { correlationId });
  return {
    type: 'error',
    content: `I could not complete the request in time. Please try again with more specific query or ask for less information.`,
  };
}
