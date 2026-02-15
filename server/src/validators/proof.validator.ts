import { z } from 'zod';

export const proofSchema = z.object({
  id: z.string(),
});

export type proofType = z.infer<typeof proofSchema>;
