import z from 'zod';

export const AgentDecisionSchema = z.object({
  thought: z.string(),
  action: z.discriminatedUnion('type', [
    z.object({ type: z.literal('respond') }),
    z.object({ type: z.literal('time') }),
    z.object({ type: z.literal('memory'), query: z.string() }),
    z.object({ type: z.literal('search'), query: z.string() }),
  ]),
});

export type AgentDecision = z.infer<typeof AgentDecisionSchema>;
