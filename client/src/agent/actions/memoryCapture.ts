import { log } from '../../observability/logger';
import type { CallLLM } from '../../services/llm/callLLM';
import { memoryCapturePrompt } from '../prompts/memoryCapturePrompt';
import { extractJSON } from '../utils/json';

export const memoryCapture = async ({
  userInput,
  signal,
  correlationId,
  callLLM,
}: {
  userInput: string;
  signal?: AbortSignal;
  correlationId?: string;
  callLLM: CallLLM;
}) => {
  const extractionCall = await callLLM({
    text: memoryCapturePrompt(userInput),
    signal,
    correlationId,
  });

  const memoryJson = extractJSON(extractionCall);
  if (!memoryJson) return null; //check

  const memory = JSON.parse(memoryJson);
  log.info('Memory captured', { correlationId, memory });
  return memory;
};
