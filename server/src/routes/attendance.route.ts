import { Hono } from 'hono';

const attendanceRoute = new Hono();

attendanceRoute.post('/mark');

export { attendanceRoute };
