import type { AgentResult } from '../types';

export const agentError = (): AgentResult => ({
  type: 'error',
  content: 'Sorry, something went wrong.',
});
