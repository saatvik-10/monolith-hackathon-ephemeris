import { Hono } from 'hono';
import { Identity } from '../controllers/identity.controller';

const identityRoute = new Hono();
const controller = new Identity();

identityRoute.post('/issue', controller.issueIdentity);
identityRoute.get('/status', controller.identityStatus);

export { identityRoute };
