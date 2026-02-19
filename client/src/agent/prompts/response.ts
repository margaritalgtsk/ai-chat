export const agentResponsePrompt = (input: string, intent: string) => {
  const baseInstruction = `You are a helpful AI assistant. 
  Respond DIRECTLY to the user's message. 
  DO NOT start with "The user said" or "The response is". 
  Always respond in the SAME LANGUAGE as the user's message.`;

  if (intent === 'chat') {
    return `${baseInstruction}
    The user is engaging in casual conversation: "${input}"
    Provide a friendly, brief, and natural response.`;
  }

  if (intent === 'question') {
    return `${baseInstruction}
    The user asked a specific question: "${input}"
    Give a clear, accurate, and concise answer.`;
  }

  return `${baseInstruction}
    The user's message is unclear: "${input}"
    Politely ask for more details or clarification to help them better.`;
};
