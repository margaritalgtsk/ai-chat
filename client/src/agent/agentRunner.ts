import z from 'zod';
import { log } from '../observability/logger';
import type { CallLLM } from '../services/llm/callLLM';
import { agentReasoningPrompt } from './prompts/reasoning';
import { agentResponsePrompt } from './prompts/response';
import type { Message } from '../types';
import { searchTool } from './tools/searchTool';
//import type { AgentDecision } from './types';

const AgentDecisionSchema = z.object({
  intent: z.enum(['chat', 'question', 'needs_clarification', 'search']),
  confidence: z.number().min(0).max(1).optional(),
  reason: z.string().optional(),
});

type AgentDecision = z.infer<typeof AgentDecisionSchema>;

function extractJSON(text: string): string | null {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

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
}) {
  log.info('Agent started', { correlationId });

  const reasoningRaw = await callLLM({
    text: agentReasoningPrompt({ userInput }),
    signal,
    correlationId,
  });

  log.info('Agent reasoning completed', { correlationId, reasoningRaw });

  const jsonString = extractJSON(reasoningRaw);
  if (!jsonString) {
    log.warn('Failed to extract JSON from agent reasoning output', {
      correlationId,
      reasoningRaw,
    });
    return {
      type: 'error',
      content: 'Sorry, something went wrong.',
    };
  }

  let decision: AgentDecision;

  try {
    const parsed = AgentDecisionSchema.safeParse(JSON.parse(jsonString));
    //decision = JSON.parse(reasoningRaw);
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
    console.log('Parsed', parsed);
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

  let toolContext = '';

  if (decision.intent === 'search') {
    log.info('Search tool invoked', { correlationId });

    const result = await searchTool(userInput);

    toolContext = `External information: ${result.result}`;
  }

  const responsePrompt = agentResponsePrompt({
    userInput,
    toolContext,
    intent: decision.intent,
    history,
  });
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
