import type { ChatErrorType } from '../../../types';

export const getErrorText = (type?: ChatErrorType) => {
  switch (type) {
    case 'network':
      return 'Network error. Please check your connection.';
    case 'rate_limit':
      return 'Too many requests. Please wait a moment and try again.';
    case 'server':
      return 'Server is unavailable. Please try again later.';
    case 'unknown':
      return 'Something went wrong.';
    default:
      return 'Failed to send message.';
  }
};
