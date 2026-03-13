import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import router from './routes/index.route';

const PORT = process.env.PORT || 8000;

const app = new Hono();

app.use(logger());
app.use(cors());

// app.get('/health', (c) => c.json({ status: 'ok' }, 200));
app.get("/health", (c) => c.text("ok"))

app.route('/api', router);

app.route;

app.notFound((c) => {
  return c.json({ err: 'Page Not Found' }, 404);
});

serve({
  fetch: app.fetch,
  port: Number(PORT),
});

console.log(`Server running on port ${PORT}`);
