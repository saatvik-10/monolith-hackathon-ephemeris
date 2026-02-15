import { Hono } from 'hono';
import { Proof } from '../controllers/proof.controller';

const proofRoute = new Hono();
const controller = new Proof();

proofRoute.post('/verify', controller.proofVerification);
proofRoute.get('', controller.getVerifictaions);

export { proofRoute };
