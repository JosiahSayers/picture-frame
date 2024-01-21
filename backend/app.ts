import { Hono } from 'hono';
import imageController from './controllers/image.controller';

const app = new Hono();

app.get('health', (c) => {
  return c.json({ status: 'ok' });
});

app.route('/images', imageController);

export default app;
