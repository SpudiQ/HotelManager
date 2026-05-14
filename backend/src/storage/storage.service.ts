import { StoredFileMeta, StoredFileMetaWithUrl } from './storage.types';

export abstract class StorageService {
  abstract save(
    file: Express.Multer.File,
    prefix: string,
  ): Promise<StoredFileMeta>;

  abstract delete(key: string): Promise<void>;

  abstract getPublicUrl(key: string): string;

  enrich(meta: StoredFileMeta): StoredFileMetaWithUrl {
    return { ...meta, url: this.getPublicUrl(meta.key) };
  }

  enrichMany(metas: StoredFileMeta[]): StoredFileMetaWithUrl[] {
    return metas.map((m) => this.enrich(m));
  }
}
