import { Hono } from 'hono';

const receiptRoute = new Hono();

receiptRoute.post('/issue');
receiptRoute.get('/:identityId');

export { receiptRoute };
