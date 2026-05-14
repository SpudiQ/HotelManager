import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { StorageService } from './storage.service';
import { StoredFileMeta } from './storage.types';

// CDN-MIGRATION: заменяется на YandexObjectStorageService (S3 SDK) при переезде
// на Yandex Cloud Object Storage.
@Injectable()
export class LocalDiskStorageService extends StorageService {
  private readonly rootDir: string;
  private readonly publicUrlBase: string;

  constructor(config: ConfigService) {
    super();
    this.rootDir = join(process.cwd(), 'uploads');
    this.publicUrlBase =
      config.get<string>('STORAGE_PUBLIC_URL_BASE') ??
      'http://localhost:3010/uploads';
  }

  async save(
    file: Express.Multer.File,
    prefix: string,
  ): Promise<StoredFileMeta> {
    const ext = extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    const key = `${prefix}/${filename}`;
    const targetDir = join(this.rootDir, prefix);
    const targetPath = join(targetDir, filename);

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetPath, file.buffer);

    return {
      key,
      mime: file.mimetype,
      size: file.size,
      // CDN-MIGRATION: width/height не считаются в local-driver. При переезде
      // на CDN можно собирать через sharp перед загрузкой либо доверить яндексу
      width: null,
      height: null,
    };
  }

  async delete(key: string): Promise<void> {
    const target = join(this.rootDir, key);
    await fs.rm(target, { force: true });
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrlBase}/${key}`;
  }
}
