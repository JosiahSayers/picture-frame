import { Hono } from 'hono';
import imageController from './controllers/image.controller';
import { logger } from 'hono/logger';

const app = new Hono().basePath('/api');

app.use('*', logger());

app.get('health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/images', imageController);

export default app;
