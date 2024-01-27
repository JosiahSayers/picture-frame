import { Hono } from 'hono';
import imageController from './controllers/image.controller';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import { stream } from 'hono/streaming';

const app = new Hono();

app.use('*', logger());

app.get('health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/api/images', imageController);

app.get('*', serveStatic({ root: 'client' }));

export default app;
