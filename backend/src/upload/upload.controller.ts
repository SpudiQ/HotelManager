import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { StoredFileMetaWithUrl } from '../storage/storage.types';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_PREFIXES = ['units', 'properties', 'workspaces', 'misc'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly storage: StorageService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPERADMIN)
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES, {
      storage: memoryStorage(),
      // CDN-MIGRATION: первая линия валидации (MIME/размер) остаётся даже после
      // переезда на CDN — отсекаем мусор до отправки в облако.
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(
            new BadRequestException(`Unsupported file type: ${file.mimetype}`),
            false,
          );
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('prefix') prefixRaw?: string,
  ): Promise<StoredFileMetaWithUrl[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const prefix = ALLOWED_PREFIXES.includes(prefixRaw ?? '')
      ? (prefixRaw as string)
      : 'misc';

    const saved = await Promise.all(
      files.map((f) => this.storage.save(f, prefix)),
    );
    return this.storage.enrichMany(saved);
  }
}
