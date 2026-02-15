import { Hono } from 'hono';
import { Attendance } from '../controllers/attendance.controller';

const attendanceRoute = new Hono();
const controller = new Attendance();

attendanceRoute.post('/mark', controller.markAttendance);

export { attendanceRoute };
