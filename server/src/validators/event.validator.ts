import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(3, 'Event name should be atleast 3 characters long'),
  image: z.url('Event image must be a valid URL'),
  startTime: z.iso.datetime('Start time must be ISO datetime'),
  endTime: z.iso.datetime('End time must be ISO datetime'),
  location: z.string('Event location is required'),
  locationURL: z.url('Event location URL must be provided'),
  organizerName: z.string(),
  organizerWallet: z.string().optional(),
  nftEnabled: z.boolean().optional().default(false),
  expiryWindow: z.number().optional().default(360),
});

export type EventType = z.infer<typeof eventSchema>;
