import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(3, 'Event name should be atleast 3 characters long'),
  image: z.string('Event image is required'),
  description: z.string('Event description is required'),
  startTime: z.string(),
  startDate: z.string(),
  endTime: z.string(),
  location: z.string('Event location is required'),
  locationURL: z.string(),
  organizerName: z.string(),
  organizerWallet: z.string('Please connect wallet to create an event'),
  nftEnabled: z.boolean().optional().default(false),
});

export type EventType = z.infer<typeof eventSchema>;
