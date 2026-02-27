import z from 'zod';

export const AgentDecisionSchema = z.object({
  thought: z.string(),
  action: z.discriminatedUnion('type', [
    z.object({ type: z.literal('respond') }),
    z.object({ type: z.literal('search'), query: z.string() }),
  ]),
  observations: z.string().optional(),
});

export type AgentDecision = z.infer<typeof AgentDecisionSchema>;

export type AgentStep = {
  thought: string;
  action: {
    type: 'respond' | 'search';
    query?: string;
  };
  observations?: string;
};

export type AgentResult =
  | { type: 'final'; content: string }
  | { type: 'error'; content: string };
