import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsInt,
  IsNumber,
  IsArray,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnitAmenity, UnitPriceMode, UnitType } from '../entities/unit.entity';

// Принимаемые от клиента метаданные фото. Поле `url` намеренно отсутствует —
// оно генерируется бэком налету при ответе и через `whitelist: true` отсекается
// на входе. См. CDN-MIGRATION в [storage.service.ts].
export class PhotoMetaDto {
  @IsString()
  key: string;

  @IsString()
  mime: string;

  @IsInt()
  @Min(0)
  size: number;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsInt()
  @Min(0)
  width?: number | null;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null)
  @IsInt()
  @Min(0)
  height?: number | null;
}

export class CreateUnitDto {
  @IsUUID()
  propertyId: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(UnitType)
  type?: UnitType;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsInt()
  @Min(1)
  maxGuests: number;

  @IsOptional()
  @IsBoolean()
  childrenAllowed?: boolean;

  @IsOptional()
  @ValidateIf((_o, value) => value !== null)
  @IsInt()
  @Min(0)
  maxChildren?: number | null;

  @IsOptional()
  @IsArray()
  @IsEnum(UnitAmenity, { each: true })
  amenities?: UnitAmenity[];

  @IsOptional()
  @ValidateIf((_o, value) => value !== null)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerNight?: number | null;

  @IsOptional()
  @ValidateIf((_o, value) => value !== null)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pricePerMonth?: number | null;

  @IsEnum(UnitPriceMode)
  priceMode: UnitPriceMode;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoMetaDto)
  photos?: PhotoMetaDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
