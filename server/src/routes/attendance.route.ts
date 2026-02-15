import { Hono } from 'hono';
import { Attendance } from '../controllers/attendance.controller';
import { proxy } from '../proxy';

const attendanceRoute = new Hono();
const controller = new Attendance();

attendanceRoute.post('/mark', proxy, controller.markAttendance);

export { attendanceRoute };
