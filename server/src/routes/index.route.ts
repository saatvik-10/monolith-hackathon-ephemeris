import { Hono } from 'hono';
import { eventRoute } from './events.route';
import { identityRoute } from './identity.route';
import { attendanceRoute } from './attendance.route';
import { receiptRoute } from './receipt.route';

const router = new Hono();

router.route('/events', eventRoute);
router.route('/identity', identityRoute);
router.route('/attendance', attendanceRoute);
router.route('/receipt', receiptRoute);

export default router;
