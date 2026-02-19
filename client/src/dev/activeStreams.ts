type ActiveStream = {
  sessionId: string;
  messageId: string;
  correlationId: string;
  startedAt: number;
  retryAttempt: number;
  status?: 'active' | 'ended' | 'aborted';
  endedAt?: number;
};

const activeStreams = new Map<string, ActiveStream>();
// key = correlationId

export const streamRegistry = {
  start(stream: ActiveStream) {
    stream.status = 'active';
    activeStreams.set(stream.correlationId, stream);
  },

  retry(correlationId: string, attempt: number) {
    const stream = activeStreams.get(correlationId);
    if (stream) {
      stream.retryAttempt = attempt;
    }
  },

  end(correlationId: string) {
    //activeStreams.delete(correlationId);
    const stream = activeStreams.get(correlationId);
    if (stream) {
      stream.status = 'ended';
      stream.endedAt = Date.now();
    }
  },

  abort(correlationId: string) {
    //activeStreams.delete(correlationId);
    const stream = activeStreams.get(correlationId);
    if (stream) {
      stream.status = 'aborted';
      stream.endedAt = Date.now();
    }
  },

  list() {
    return Array.from(activeStreams.values());
  },
};
