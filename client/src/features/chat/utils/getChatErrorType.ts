import type { ChatErrorType } from '../../../types';

export const getChatErrorType = (error: unknown): ChatErrorType => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'abort';
  }
  if (error instanceof TypeError) {
    return 'network';
  }
  if (error instanceof Error) {
    if (error.message === 'RATE_LIMIT') {
      return 'rate_limit';
    }
    if (error.message === 'Server error') {
      return 'server';
    }
  }
  return 'unknown';
};
