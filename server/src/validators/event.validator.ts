import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(3, 'Event name should be atleast 3 characters long'),
  image: z.string('Event image is required'),
  startTime: z.date(),
  endTime: z.date(),
  expiryWindow: z.number(),
});

export type EventType = z.infer<typeof eventSchema>;
