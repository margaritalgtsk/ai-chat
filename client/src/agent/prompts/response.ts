import type { Message } from '../../types';

export const agentResponsePrompt = ({
  userInput,
  toolContext,
  intent,
  history,
}: {
  userInput: string;
  toolContext?: string;
  intent: string;
  history?: Message[];
}) => {
  const historyText = history
    ?.map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');
  const conversationContext = historyText?.trim().length
    ? historyText
    : 'No previous messages.';

  console.log(
    'Generated conversation context for response prompt:',
    conversationContext
  );

  const baseInstruction = `You are a helpful AI assistant. 
  Conversation so far:
  ${conversationContext}

  ${toolContext ?? ''}

  Respond DIRECTLY to the user's message. 
  DO NOT start with "The user said" or "The response is". 
  Always respond in the SAME LANGUAGE as the user's message.`;

  if (intent === 'chat') {
    return `${baseInstruction}
    The user is engaging in casual conversation: "${userInput}"
    Provide a friendly, brief, and natural response.`;
  }

  if (intent === 'question') {
    return `${baseInstruction}
    The user asked a specific question: "${userInput}"
    Give a clear, accurate, and concise answer.`;
  }

  return `${baseInstruction}
    The user's message is unclear: "${userInput}"
    Politely ask for more details or clarification to help them better.`;
};
