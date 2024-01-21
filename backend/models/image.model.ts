import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { Environment } from '../utils/environment';

export class Image {
  static list() {
    return readdir(Environment.storagePath);
  }

  private file(name: string) {
    const filepath = path.join(Environment.storagePath, name);
    return Bun.file(filepath);
  }
}
