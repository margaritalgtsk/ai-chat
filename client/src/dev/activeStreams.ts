type ActiveStream = {
  sessionId: string;
  messageId: string;
  correlationId: string;
  startedAt: number;
  retryAttempt: number;
};

const activeStreams = new Map<string, ActiveStream>();
// key = correlationId

export const streamRegistry = {
  start(stream: ActiveStream) {
    activeStreams.set(stream.correlationId, stream);
  },

  retry(correlationId: string, attempt: number) {
    const stream = activeStreams.get(correlationId);
    if (stream) {
      stream.retryAttempt = attempt;
    }
  },

  end(correlationId: string) {
    activeStreams.delete(correlationId);
  },

  abort(correlationId: string) {
    activeStreams.delete(correlationId);
  },

  list() {
    return Array.from(activeStreams.values());
  },
};
