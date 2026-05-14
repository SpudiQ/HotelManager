import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { LocalDiskStorageService } from './local-disk-storage.service';

// CDN-MIGRATION: можно добавить ветку 'yandex' (YandexObjectStorageService на @aws-sdk/client-s3),
// выбираемую через env STORAGE_DRIVER=yandex.
@Module({
  providers: [
    {
      provide: StorageService,
      inject: [ConfigService],
      useFactory: (config: ConfigService): StorageService => {
        const driver = config.get<string>('STORAGE_DRIVER') ?? 'local';
        switch (driver) {
          case 'local':
            return new LocalDiskStorageService(config);
          case 'yandex':
            throw new Error('STORAGE_DRIVER=yandex is not implemented yet');
          default:
            throw new Error(`Unknown STORAGE_DRIVER: ${driver}`);
        }
      },
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
