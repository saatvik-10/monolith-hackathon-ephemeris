import { Hono } from 'hono';
import { Join } from '../controllers/join.controller';

const joinRoute = new Hono();
const controller = new Join();

joinRoute.get('/:eventId', controller.getEvent);

export { joinRoute };
