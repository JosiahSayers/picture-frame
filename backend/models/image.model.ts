import { readdir } from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime';
import { Environment } from '../utils/environment';

const lastUploadTimeName = 'last-upload-time.txt';

export class Image {
  static async list() {
    const fileList = await readdir(Environment.storagePath);
    return fileList.filter(
      (file) => mime.getType(file)?.split('/')[0] === 'image'
    );
  }

  static async load(name: string) {
    if (!(await this.file(name).exists())) {
      return null;
    }
    return { stream: this.file(name).stream(), mimeType: mime.getType(name)! };
  }

  static async store(name: string, data: Blob) {
    await Bun.write(this.filePath(name), data);
    return Bun.write(
      this.filePath(lastUploadTimeName),
      new Date().toISOString()
    );
  }

  static async lastUploadTime() {
    if (await this.file(lastUploadTimeName).exists()) {
      return this.file(lastUploadTimeName).text();
    }

    return null;
  }

  private static file(name: string) {
    return Bun.file(this.filePath(name));
  }

  private static filePath(name: string) {
    return path.join(Environment.storagePath, name);
  }
}
