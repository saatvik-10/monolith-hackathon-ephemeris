import { Hono } from 'hono';
import { Events } from '../controllers/events.controller';

const eventRoute = new Hono();
const controller = new Events();

eventRoute.post('/create', controller.createEvent);
eventRoute.get('/:eventId', controller.getEventId);
eventRoute.get('/:eventId/qr', controller.getEventQr);
eventRoute.delete('/:eventId', controller.deleteEvent)

export { eventRoute };
