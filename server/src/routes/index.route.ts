import { Hono } from 'hono';
import { eventRoute } from './events.route';
import { identityRoute } from './identity.route';

const router = new Hono();

router.route('/events', eventRoute);
router.route('/identity', identityRoute);

export default router;
