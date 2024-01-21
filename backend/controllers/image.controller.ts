import { Hono } from 'hono';
import { Image } from '../models/image.model';
import { stream } from 'hono/streaming';

const controller = new Hono();

controller.get('/', async (c) => {
  const files = await Image.list();
  return c.json({ files });
});

controller.get('/:name', async (c) => {
  const image = await Image.load(c.req.param('name'));
  if (image === null) {
    return c.status(404);
  }
  c.header('Content-Type', image.mimeType);
  return stream(c, (currentStream) => currentStream.pipe(image.stream));
});

controller.post('/', async (c) => {
  const form = await c.req.formData();
  const file = form.get('file');
  const name = form.get('name')!;
  const errors = [];
  if (!file) {
    errors.push('File missing');
  } else if (file instanceof Blob === false) {
    errors.push('File is not a file upload');
  }

  if (!name) {
    errors.push('File name missing');
  }

  if (errors.length > 0) {
    return c.json({ errors }, 400);
  }
  console.log(file);

  await Image.store(name as string, file as any);

  return c.json({ url: `/images/${name}` }, 200);
});

export default controller;
