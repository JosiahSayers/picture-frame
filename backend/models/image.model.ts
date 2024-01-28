import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime';
import { v4 as uuid } from 'uuid';
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
    const file = await this.confirmFileExists(name);
    return { stream: file.stream(), mimeType: mime.getType(name) ?? '' };
  }

  static async store(name: string, data: Blob) {
    const storageName = await this.createUniqueName(name);
    await Bun.write(this.filePath(storageName), data);
    return this.recordLastUpdateTime();
  }

  static async delete(name: string) {
    await this.confirmFileExists(name);
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

  private static async createUniqueName(name: string) {
    const format = name.split('.').pop();
    let nameCandidate = '';
    let iteration = 0;
    do {
      if (iteration > 10) {
        throw new Error('Unable to find unique filename');
      }
      nameCandidate = `${uuid()}.${format}`;
      iteration++;
    } while (await this.file(nameCandidate).exists());
    return nameCandidate;
  }

  private static async confirmFileExists(name: string) {
    const file = this.file(name);
    const fileExists = await file.exists();
    if (!fileExists) {
      throw new FileNotFoundError();
    }
    return file;
  }

  private static async recordLastUpdateTime() {
    return Bun.write(
      this.filePath(lastUploadTimeName),
      new Date().toISOString()
    );
  }
}

export class FileNotFoundError extends Error {}
