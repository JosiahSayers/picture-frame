import { Hono } from 'hono';
import { Image } from '../models/image.model';

const controller = new Hono();

controller.get('/', async (c) => {
  const files = await Image.list();
  if (files && files.length > 0) {
    return c.json({ files });
  }

  return c.status(404);
});

export default controller;
