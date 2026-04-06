import { runAgent } from '../agentRunner';

// --- Mock all dependencies ---

jest.mock('../prompts/reasoning', () => ({
  agentReasoningPrompt: jest.fn(() => 'reasoning-prompt'),
}));

jest.mock('../prompts/criticPrompt', () => ({
  criticPrompt: jest.fn(() => 'critic-prompt'),
}));

jest.mock('../actions/parseDecision', () => ({
  parseDecision: jest.fn(),
}));

jest.mock('../actions/parseCritic', () => ({
  parseCritic: jest.fn(),
}));

jest.mock('../actions/finalize', () => ({
  finalize: jest.fn(),
}));

jest.mock('../actions/memoryCapture', () => ({
  memoryCapture: jest.fn(),
}));

jest.mock('../utils/error', () => ({
  agentError: () => ({ type: 'error', content: 'Sorry, something went wrong.' }),
}));

jest.mock('../tools/toolExecution', () => ({
  toolExecution: jest.fn(),
}));

jest.mock('../memory/memoryStore', () => ({
  memoryStore: {
    getAll: jest.fn(() => []),
    add: jest.fn(),
  },
}));

jest.mock('../../observability/logger', () => ({
  log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// --- Import mocked modules for assertions ---

import { parseDecision } from '../actions/parseDecision';
import { parseCritic } from '../actions/parseCritic';
import { finalize } from '../actions/finalize';
import { memoryCapture } from '../actions/memoryCapture';
import { toolExecution } from '../tools/toolExecution';
import { memoryStore } from '../memory/memoryStore';

const mockParseDecision = parseDecision as jest.Mock;
const mockParseCritic = parseCritic as jest.Mock;
const mockFinalize = finalize as jest.Mock;
const mockMemoryCapture = memoryCapture as jest.Mock;
const mockToolExecution = toolExecution as jest.Mock;
const mockMemoryStoreAdd = memoryStore.add as jest.Mock;

// --- Helpers ---

const makeCallLLM = (responses: string[]) => {
  let i = 0;
  return jest.fn(async () => responses[i++] ?? '');
};

const respondDecision = () => ({
  thought: 'I have enough info',
  action: { type: 'respond' as const },
});

const searchDecision = (query: string) => ({
  thought: 'Searching for info',
  action: { type: 'search' as const, query },
});

const finalResult = () => ({ type: 'final' as const, content: 'Final answer' });
const noRetry = () => ({ retry: false });
const retryWithFeedback = (feedback: string) => ({ retry: true, feedback });

// Shared defaults applied in each test that needs them
const setupDefaultMocks = () => {
  mockFinalize.mockResolvedValue(finalResult());
  mockParseCritic.mockReturnValue(noRetry());
  mockMemoryCapture.mockResolvedValue(null);
  mockToolExecution.mockReturnValue({ success: true, result: 'tool result' });
};

// --- Tests ---

describe('runAgent', () => {
  // Use resetAllMocks to fully clear implementations AND call history between tests,
  // preventing mock state from bleeding across tests.
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('happy path', () => {
    it('returns final answer when agent responds immediately without critic retry', async () => {
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(respondDecision());

      const callLLM = makeCallLLM(['reasoning', 'critic']);
      const result = await runAgent({ userInput: 'hello', callLLM });

      expect(result).toEqual({ type: 'final', content: 'Final answer' });
      expect(mockFinalize).toHaveBeenCalledTimes(1);
    });

    it('passes history and correlationId through to finalize', async () => {
      setupDefaultMocks();
      const history = [{ id: '1', role: 'user' as const, content: 'hi' }];
      mockParseDecision.mockReturnValue(respondDecision());

      const callLLM = makeCallLLM(['reasoning', 'critic']);
      await runAgent({ userInput: 'hello', history, callLLM, correlationId: 'abc' });

      expect(mockFinalize).toHaveBeenCalledWith(
        expect.objectContaining({
          history,
          agentContext: expect.objectContaining({ correlationId: 'abc' }),
        })
      );
    });
  });

  describe('critic loop', () => {
    it('retries once when critic requests a retry on respond action', async () => {
      setupDefaultMocks();
      // First respond: critic says retry; second respond: no critic (postCriticSteps > 0)
      mockParseDecision
        .mockReturnValueOnce(respondDecision())
        .mockReturnValueOnce(respondDecision());
      mockParseCritic.mockReturnValue(retryWithFeedback('Add more detail'));

      const callLLM = makeCallLLM(['r0', 'critic0', 'r1', 'final1']);
      const result = await runAgent({ userInput: 'hello', callLLM });

      expect(result).toEqual({ type: 'final', content: 'Final answer' });
      // Critic should only fire once
      expect(mockParseCritic).toHaveBeenCalledTimes(1);
      expect(mockFinalize).toHaveBeenCalledTimes(2);
    });

    it('does not call critic a second time when postCriticSteps > 0', async () => {
      setupDefaultMocks();
      mockParseDecision
        .mockReturnValueOnce(respondDecision())
        .mockReturnValueOnce(respondDecision());
      mockParseCritic.mockReturnValueOnce(retryWithFeedback('Be concise'));

      const callLLM = makeCallLLM(['r', 'c', 'r2', 'final2']);
      await runAgent({ userInput: 'test', callLLM });

      expect(mockParseCritic).toHaveBeenCalledTimes(1);
    });
  });

  describe('search actions', () => {
    it('executes search tool and continues the loop', async () => {
      setupDefaultMocks();
      mockParseDecision
        .mockReturnValueOnce(searchDecision('js async'))
        .mockReturnValueOnce(respondDecision());

      const callLLM = makeCallLLM(['r0', 'r1', 'critic', 'final']);
      const result = await runAgent({ userInput: 'find js async info', callLLM });

      expect(result).toEqual(finalResult());
      expect(mockToolExecution).toHaveBeenCalledWith({ type: 'search', query: 'js async' });
    });

    it('skips a duplicate search query and adds an observation', async () => {
      setupDefaultMocks();
      mockParseDecision
        .mockReturnValueOnce(searchDecision('duplicate query'))
        .mockReturnValueOnce(searchDecision('duplicate query')) // same → skip
        .mockReturnValueOnce(respondDecision());

      const callLLM = makeCallLLM(['r0', 'r1', 'r2', 'critic', 'final']);
      await runAgent({ userInput: 'test', callLLM });

      // Tool only called once despite two decisions with the same query
      expect(mockToolExecution).toHaveBeenCalledTimes(1);
    });

    it('allows a new search query after a different first query', async () => {
      setupDefaultMocks();
      mockParseDecision
        .mockReturnValueOnce(searchDecision('query-a'))
        .mockReturnValueOnce(searchDecision('query-b'))
        .mockReturnValueOnce(respondDecision());

      const callLLM = makeCallLLM(['r0', 'r1', 'r2', 'critic', 'final']);
      await runAgent({ userInput: 'test', callLLM });

      expect(mockToolExecution).toHaveBeenCalledTimes(2);
    });

    it('calls toolExecution with the full action object', async () => {
      setupDefaultMocks();
      mockParseDecision
        .mockReturnValueOnce(searchDecision('TypeScript generics'))
        .mockReturnValueOnce(respondDecision());

      const callLLM = makeCallLLM(['r0', 'r1', 'critic', 'final']);
      await runAgent({ userInput: 'TypeScript generics', callLLM });

      expect(mockToolExecution).toHaveBeenCalledWith({
        type: 'search',
        query: 'TypeScript generics',
      });
    });
  });

  describe('tool execution failures', () => {
    it('does not push a step when tool execution fails, eventually hitting MAX_STEPS', async () => {
      // With tool always failing: no steps are pushed, no respond is reached,
      // so the agent exhausts MAX_STEPS and returns the time-out error.
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(searchDecision('q'));
      mockToolExecution.mockReturnValue({ success: false });

      const callLLM = makeCallLLM(['r0', 'r1', 'r2']);
      const result = await runAgent({ userInput: 'test', callLLM });

      expect(result.type).toBe('error');
      expect(mockFinalize).not.toHaveBeenCalled();
    });
  });

  describe('memory capture', () => {
    it('stores a memory entry when memoryCapture returns a value', async () => {
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(respondDecision());
      mockMemoryCapture.mockResolvedValue({ key: 'user-name', value: 'Alice' });

      const callLLM = makeCallLLM(['r', 'critic', 'memory']);
      await runAgent({ userInput: 'My name is Alice', callLLM });

      expect(mockMemoryStoreAdd).toHaveBeenCalledWith('user-name', 'Alice');
    });

    it('does not call memoryStore.add when memoryCapture returns null', async () => {
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(respondDecision());

      const callLLM = makeCallLLM(['r', 'critic', 'memory']);
      await runAgent({ userInput: 'hello', callLLM });

      expect(mockMemoryStoreAdd).not.toHaveBeenCalled();
    });
  });

  describe('error cases', () => {
    it('returns agentError when parseDecision returns null', async () => {
      mockParseDecision.mockReturnValue(null);

      const callLLM = makeCallLLM(['unparseable output']);
      const result = await runAgent({ userInput: 'hello', callLLM });

      expect(result).toEqual({ type: 'error', content: 'Sorry, something went wrong.' });
    });

    it('returns max-steps error when all iterations are used without finalizing', async () => {
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(searchDecision('q'));
      mockToolExecution.mockReturnValue({ success: false });

      const callLLM = makeCallLLM(['r0', 'r1', 'r2']);
      const result = await runAgent({ userInput: 'test', callLLM });

      expect(result).toMatchObject({
        type: 'error',
        content: expect.stringContaining('could not complete'),
      });
    });

    it('max-steps error message asks user to retry with a more specific query', async () => {
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(searchDecision('q'));
      mockToolExecution.mockReturnValue({ success: false });

      const callLLM = makeCallLLM(['r0', 'r1', 'r2']);
      const result = await runAgent({ userInput: 'test', callLLM });

      expect((result as { content: string }).content).toMatch(/Please try again/i);
    });
  });

  describe('abort signal', () => {
    it('propagates the abort signal to callLLM', async () => {
      setupDefaultMocks();
      mockParseDecision.mockReturnValue(respondDecision());

      const controller = new AbortController();
      const callLLM = jest.fn(async () => 'response');

      await runAgent({ userInput: 'hello', callLLM, signal: controller.signal });

      expect(callLLM).toHaveBeenCalledWith(
        expect.objectContaining({ signal: controller.signal })
      );
    });

    it('rejects if callLLM throws due to abort', async () => {
      const controller = new AbortController();
      controller.abort();

      const callLLM = jest.fn(async () => {
        throw new DOMException('Aborted', 'AbortError');
      });

      await expect(
        runAgent({ userInput: 'hello', callLLM, signal: controller.signal })
      ).rejects.toThrow('Aborted');
    });
  });
});
