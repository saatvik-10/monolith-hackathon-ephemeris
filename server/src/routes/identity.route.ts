import { Hono } from 'hono';
import { Identity } from '../controllers/identity.controller';
import { proxy } from '../proxy';

const identityRoute = new Hono();
const controller = new Identity();

identityRoute.post('/issue/:eventId', controller.issueIdentity);
identityRoute.get('/status', proxy, controller.identityStatus);

export { identityRoute };
