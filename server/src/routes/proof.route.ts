import { Hono } from 'hono';
import { Proof } from '../controllers/proof.controller';
import { proxy } from '../proxy';

const proofRoute = new Hono();
const controller = new Proof();

proofRoute.post('/verify', controller.proofVerification);
proofRoute.get('', proxy, controller.getVerifications);

export { proofRoute };
