import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../../property/entities/property.entity';
import { StoredFileMeta } from '../../storage/storage.types';

export enum UnitType {
  ROOM = 'room',
  HOUSE = 'house',
  APARTMENT = 'apartment',
  PLACE = 'place',
  TENT = 'tent',
}

export enum UnitPriceMode {
  NIGHT = 'night',
  MONTH = 'month',
  BOTH = 'both',
}

export enum UnitAmenity {
  WIFI = 'wifi',
  AC = 'ac',
  TV = 'tv',
  KITCHEN = 'kitchen',
  BATHROOM_PRIVATE = 'bathroom_private',
  BREAKFAST = 'breakfast',
  PARKING = 'parking',
  POOL = 'pool',
  HEATING = 'heating',
  WORKSPACE = 'workspace',
  WASHER = 'washer',
  BALCONY = 'balcony',
  PETS_ALLOWED = 'pets_allowed',
  SMOKING_ALLOWED = 'smoking_allowed',
}

// numeric → number transformer; postgres returns numeric as string by default.
const numericTransformer = {
  to: (value: number | null | undefined): number | null | undefined => value,
  from: (value: string | null): number | null =>
    value === null ? null : Number(value),
};

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: UnitType, default: UnitType.ROOM })
  type: UnitType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 1 })
  maxGuests: number;

  @Column({ default: false })
  childrenAllowed: boolean;

  @Column({ type: 'int', nullable: true })
  maxChildren: number | null;

  @Column({ type: 'json', default: () => "'[]'" })
  amenities: UnitAmenity[];

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  pricePerNight: number | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  pricePerMonth: number | null;

  @Column({ type: 'enum', enum: UnitPriceMode, default: UnitPriceMode.NIGHT })
  priceMode: UnitPriceMode;

  // CDN-MIGRATION: в БД храним только метаданные (key/mime/size/...). Поле `url`
  // не хранится — собирается налету в UnitService через StorageService.enrich.
  // При переезде на CDN меняется только реализация getPublicUrl — данные не мигрируют.
  @Column({ type: 'json', default: () => "'[]'" })
  photos: StoredFileMeta[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
