import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(3, 'Event name should be atleast 3 characters long'),
  image: z.url('Event image must be a valid URL'),
  startTime: z.iso.datetime('Start time must be ISO datetime'),
  endTime: z.iso.datetime('End time must be ISO datetime'),
  organizerWallet: z.string().optional(),
  nftEnabled: z.boolean().optional().default(false),
  expiryWindow: z.number().optional().default(360),
});

export type EventType = z.infer<typeof eventSchema>;
