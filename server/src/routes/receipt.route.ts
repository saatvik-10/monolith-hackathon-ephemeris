import { Hono } from 'hono';
import { Receipt } from '../controllers/receipt.controller';
import { proxy } from '../proxy';

const receiptRoute = new Hono();
const controller = new Receipt();

receiptRoute.post('/issue', proxy, controller.issueReceipt);
receiptRoute.get('', proxy, controller.getReceipts);

export { receiptRoute };
