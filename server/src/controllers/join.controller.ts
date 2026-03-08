import type { Context } from 'hono';
import { prisma } from '../../prisma';

export class Join {
  async getEvent(ctx: Context) {
    const eventId = ctx.req.param('eventId');

    try {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          startTime: true,
          endTime: true,
          location: true,
          locationURL: true,
          organizerName: true,
          nftEnabled: true,
          image: true,
        },
      });

      if (!event) {
        return ctx.json({ error: 'Event not found' }, 404);
      }

      return ctx.json({
        event,
        action: 'attend',
        message: `Scan this QR in Ephemeris to mark your attendance for "${event.name}"`,
      });
    } catch (err) {
      console.error('Error fetching join event', err);
      return ctx.json({ error: 'Failed to fetch event' }, 500);
    }
  }
}
