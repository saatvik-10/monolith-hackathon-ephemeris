import { Hono } from 'hono';

const proofRoute = new Hono();

proofRoute.post('/verify');
proofRoute.get('/:identityId');

export { proofRoute };
