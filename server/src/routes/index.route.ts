import { Hono } from 'hono';
import { eventRoute } from './events.route';

const router = new Hono();

router.route('/events', eventRoute);

export default router;
