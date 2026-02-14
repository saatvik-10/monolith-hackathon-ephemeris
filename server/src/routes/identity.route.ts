import { Hono } from 'hono';

const identityRoute = new Hono();

identityRoute.post('/issue');
identityRoute.get('/status');

export { identityRoute };
