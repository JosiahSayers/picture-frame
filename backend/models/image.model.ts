import { readdir, unlink } from 'node:fs/promises';
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
    return this.recordLastUpdateTime();
  }

  static async delete(name: string) {
    const fileExists = await this.file(name).exists();
    if (!fileExists) {
      throw new FileNotFoundError();
    }
    await unlink(this.filePath(name));
    return this.recordLastUpdateTime();
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

  private static async recordLastUpdateTime() {
    return Bun.write(
      this.filePath(lastUploadTimeName),
      new Date().toISOString()
    );
  }
}

export class FileNotFoundError extends Error {}
