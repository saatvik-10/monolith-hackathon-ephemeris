import { Hono } from 'hono';

const eventRoute = new Hono();

eventRoute.post('');
eventRoute.get('/:eventId');
eventRoute.get('/:eventId/qr');

export { eventRoute };
