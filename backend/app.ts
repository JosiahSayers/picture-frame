import { Hono } from 'hono';
import imageController from './controllers/image.controller';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

app.get('health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/images', imageController);

if (Bun.env.NODE_ENV === 'development') {
  app.use('*', (c) => {
    return fetch(`http://localhost:5173/${c.req.path}`);
  });
}

export default app;
