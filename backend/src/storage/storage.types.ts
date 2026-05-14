export interface StoredFileMeta {
  key: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
}

export interface StoredFileMetaWithUrl extends StoredFileMeta {
  url: string;
}
