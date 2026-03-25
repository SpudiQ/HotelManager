import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UniquenessValidator } from '../common/validators/uniqueness.validator';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private uniquenessValidator: UniquenessValidator,
  ) {}

  async create(createDto: CreateWorkspaceDto): Promise<Workspace> {
    await this.uniquenessValidator.validate(
      this.workspaceRepository,
      'name',
      createDto.name,
    );
    await this.uniquenessValidator.validate(
      this.workspaceRepository,
      'slug',
      createDto.slug,
    );
    const workspace = this.workspaceRepository.create(createDto);
    return this.workspaceRepository.save(workspace);
  }

  async findAll(): Promise<Workspace[]> {
    return this.workspaceRepository.find();
  }

  async findOne(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new NotFoundException(`Workspace with id ${id} not found`);
    }
    return workspace;
  }

  private async findBySlug(slug: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { slug },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace with slug "${slug}" not found`);
    }
    return workspace;
  }

  async findByIdOrSlug(identifier: string): Promise<Workspace> {
    const isUuid = isUUID(identifier);
    if (isUuid) {
      return this.findOne(identifier);
    } else {
      return this.findBySlug(identifier);
    }
  }

  async update(id: string, updateDto: UpdateWorkspaceDto): Promise<Workspace> {
    const workspace = await this.findOne(id);
    if (updateDto.name && updateDto.name !== workspace.name) {
      await this.uniquenessValidator.validate(
        this.workspaceRepository,
        'name',
        updateDto.name,
        id,
      );
    }
    if (updateDto.slug && updateDto.slug !== workspace.slug) {
      await this.uniquenessValidator.validate(
        this.workspaceRepository,
        'slug',
        updateDto.slug,
        id,
      );
    }
    Object.assign(workspace, updateDto);
    return this.workspaceRepository.save(workspace);
  }

  async remove(id: string): Promise<void> {
    const result = await this.workspaceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Workspace with id ${id} not found`);
    }
  }
}
