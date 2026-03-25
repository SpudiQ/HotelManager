import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UniquenessValidator } from '../common/validators/uniqueness.validator';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private uniquenessValidator: UniquenessValidator,
  ) {}

  async create(createDto: CreatePropertyDto): Promise<Property> {
    await this.uniquenessValidator.validate(
      this.propertyRepository,
      'slug',
      createDto.slug,
    );
    const property = this.propertyRepository.create(createDto);
    return this.propertyRepository.save(property);
  }

  async findAll(workspaceId?: string): Promise<Property[]> {
    const where = workspaceId ? { workspaceId } : {};
    return this.propertyRepository.find({ where });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
    return property;
  }

  private async findBySlug(slug: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { slug } });
    if (!property) {
      throw new NotFoundException(`Property with slug "${slug}" not found`);
    }
    return property;
  }

  async findByIdOrSlug(identifier: string): Promise<Property> {
    const isUuid = isUUID(identifier);
    if (isUuid) {
      return this.findOne(identifier);
    } else {
      return this.findBySlug(identifier);
    }
  }

  async update(id: string, updateDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    // If slug is being changed, validate globally
    if (updateDto.slug && updateDto.slug !== property.slug) {
      await this.uniquenessValidator.validate(
        this.propertyRepository,
        'slug',
        updateDto.slug,
        id,
      );
    }
    Object.assign(property, updateDto);
    return this.propertyRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
  }
}
