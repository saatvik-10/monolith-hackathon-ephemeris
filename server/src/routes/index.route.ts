import { Hono } from 'hono';
import { eventRoute } from './events.route';
import { identityRoute } from './identity.route';
import { attendanceRoute } from './attendance.route';

const router = new Hono();

router.route('/events', eventRoute);
router.route('/identity', identityRoute);
router.route('/attendance', attendanceRoute);

export default router;
