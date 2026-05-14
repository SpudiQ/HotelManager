import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Unit, UnitPriceMode } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UniquenessValidator } from '../common/validators/uniqueness.validator';
import { StorageService } from '../storage/storage.service';
import { StoredFileMetaWithUrl } from '../storage/storage.types';

export type UnitWithPhotoUrls = Omit<Unit, 'photos'> & {
  photos: StoredFileMetaWithUrl[];
};

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    private uniquenessValidator: UniquenessValidator,
    private storage: StorageService,
  ) {}

  private assertPriceConsistency(
    priceMode: UnitPriceMode,
    pricePerNight: number | null | undefined,
    pricePerMonth: number | null | undefined,
  ): void {
    const hasNight = pricePerNight !== null && pricePerNight !== undefined;
    const hasMonth = pricePerMonth !== null && pricePerMonth !== undefined;

    if (priceMode === UnitPriceMode.NIGHT && !hasNight) {
      throw new BadRequestException(
        'pricePerNight is required when priceMode is "night"',
      );
    }
    if (priceMode === UnitPriceMode.MONTH && !hasMonth) {
      throw new BadRequestException(
        'pricePerMonth is required when priceMode is "month"',
      );
    }
    if (priceMode === UnitPriceMode.BOTH && !(hasNight && hasMonth)) {
      throw new BadRequestException(
        'pricePerNight and pricePerMonth are both required when priceMode is "both"',
      );
    }
  }

  // Клеит url к каждой фотографии. Используется на любом исходящем пути.
  private withPhotoUrls(unit: Unit): UnitWithPhotoUrls {
    return { ...unit, photos: this.storage.enrichMany(unit.photos ?? []) };
  }

  async create(createDto: CreateUnitDto): Promise<UnitWithPhotoUrls> {
    await this.uniquenessValidator.validate(
      this.unitRepository,
      'slug',
      createDto.slug,
    );
    this.assertPriceConsistency(
      createDto.priceMode,
      createDto.pricePerNight,
      createDto.pricePerMonth,
    );
    const unit = this.unitRepository.create(createDto);
    const saved = await this.unitRepository.save(unit);
    return this.withPhotoUrls(saved);
  }

  async findAll(propertyId?: string): Promise<UnitWithPhotoUrls[]> {
    const where = propertyId ? { propertyId } : {};
    const units = await this.unitRepository.find({ where });
    return units.map((u) => this.withPhotoUrls(u));
  }

  async findOne(id: string): Promise<UnitWithPhotoUrls> {
    const unit = await this.findOneRaw(id);
    return this.withPhotoUrls(unit);
  }

  private async findOneRaw(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }
    return unit;
  }

  private async findBySlug(slug: string): Promise<UnitWithPhotoUrls> {
    const unit = await this.unitRepository.findOne({ where: { slug } });
    if (!unit) {
      throw new NotFoundException(`Unit with slug "${slug}" not found`);
    }
    return this.withPhotoUrls(unit);
  }

  async findByIdOrSlug(identifier: string): Promise<UnitWithPhotoUrls> {
    if (isUUID(identifier)) {
      return this.findOne(identifier);
    }
    return this.findBySlug(identifier);
  }

  async update(
    id: string,
    updateDto: UpdateUnitDto,
  ): Promise<UnitWithPhotoUrls> {
    const unit = await this.findOneRaw(id);
    if (updateDto.slug && updateDto.slug !== unit.slug) {
      await this.uniquenessValidator.validate(
        this.unitRepository,
        'slug',
        updateDto.slug,
        id,
      );
    }

    const nextPriceMode = updateDto.priceMode ?? unit.priceMode;
    const nextPricePerNight =
      updateDto.pricePerNight === undefined
        ? unit.pricePerNight
        : updateDto.pricePerNight;
    const nextPricePerMonth =
      updateDto.pricePerMonth === undefined
        ? unit.pricePerMonth
        : updateDto.pricePerMonth;
    this.assertPriceConsistency(
      nextPriceMode,
      nextPricePerNight,
      nextPricePerMonth,
    );

    // CDN-MIGRATION: при замене массива фото — удаляем "осиротевшие" объекты
    // из хранилища. На CDN можно вместо этого положиться на lifecycle policy
    // (например, чистить ключи без ссылок раз в сутки).
    if (updateDto.photos) {
      const nextKeys = new Set(updateDto.photos.map((p) => p.key));
      const orphans = (unit.photos ?? []).filter((p) => !nextKeys.has(p.key));
      await Promise.allSettled(orphans.map((p) => this.storage.delete(p.key)));
    }

    Object.assign(unit, updateDto);
    const saved = await this.unitRepository.save(unit);
    return this.withPhotoUrls(saved);
  }

  async remove(id: string): Promise<void> {
    const unit = await this.findOneRaw(id);
    // CDN-MIGRATION: на CDN — lifecycle policy в бакете вместо явного delete.
    await Promise.allSettled(
      (unit.photos ?? []).map((p) => this.storage.delete(p.key)),
    );
    const result = await this.unitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unit with id ${id} not found`);
    }
  }
}
