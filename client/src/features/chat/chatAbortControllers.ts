export const chatAbortControllers = new Map<string, AbortController>();

export const abortChatStream = (sessionId: string) => {
  chatAbortControllers.get(sessionId)?.abort();
  chatAbortControllers.delete(sessionId);
};

export const createChatAbortController = (sessionId: string) => {
  abortChatStream(sessionId); //?
  const controller = new AbortController();
  chatAbortControllers.set(sessionId, controller);
  return controller; //Why not chatAbortControllers
};
