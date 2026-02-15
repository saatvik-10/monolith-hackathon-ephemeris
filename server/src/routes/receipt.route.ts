import { Hono } from 'hono';
import { Receipt } from '../controllers/receipt.controller';

const receiptRoute = new Hono();
const controller = new Receipt();

receiptRoute.post('/issue', controller.issueReceipt);
receiptRoute.get('', controller.getReceipts);

export { receiptRoute };
