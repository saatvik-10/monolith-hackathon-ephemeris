import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(3, 'Event name should be atleast 3 characters long'),
  image: z.string('Event image is required'),
  description: z.string('Event description is required'),
  startTime: z.string().datetime('Start time must be ISO datetime'),
  startDate: z.string('Event date is required'),
  endTime: z.string().datetime('End time must be ISO datetime'),
  location: z.string('Event location is required'),
  locationURL: z.url('Event location URL must be provided'),
  organizerName: z.string(),
  organizerWallet: z.string('Please connect wallet to create an event'),
  nftEnabled: z.boolean().optional().default(false),
});

export type EventType = z.infer<typeof eventSchema>;
