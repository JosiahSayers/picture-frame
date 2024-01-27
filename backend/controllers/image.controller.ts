import { Hono } from 'hono';
import { FileNotFoundError, Image } from '../models/image.model';
import { stream } from 'hono/streaming';

const controller = new Hono();

controller.get('/', async (c) => {
  const files = await Image.list();
  const lastUpdated = await Image.lastUploadTime();
  return c.json({ files, lastUpdated });
});

controller.get('/last-upload', async (c) => {
  return c.json({ date: await Image.lastUploadTime() }, 200);
});

controller.get('/:name', async (c) => {
  const image = await Image.load(c.req.param('name'));
  if (image === null) {
    return c.text('Not Found', 404);
  }
  c.header('Content-Type', image.mimeType);
  return stream(c, (currentStream) => currentStream.pipe(image.stream));
});

controller.delete('/:name', async (c) => {
  const name = c.req.param('name');
  if (name.length < 4) {
    return c.json({ error: 'File name not long enough to be valid' }, 400);
  }

  try {
    await Image.delete(name);
    return c.text('No Content', 204);
  } catch (e) {
    if (e instanceof FileNotFoundError) {
      return c.text('Not Found', 404);
    }
    return c.text('Internal Server Error', 500);
  }
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

  await Image.store(name as string, file as any);

  return c.json({ url: `/images/${name}` }, 200);
});

export default controller;
