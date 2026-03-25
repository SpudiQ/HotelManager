import { Injectable, ConflictException } from '@nestjs/common';
import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UniquenessValidator {
  /**
   * Validates that a given field value is unique in the repository
   * Optionally accepts additional where conditions (something like - workspaceId) for composite uniqueness
   * @param repository TypeORM repository
   * @param field field name to check
   * @param value value to check
   * @param excludeId optional ID to exclude from check (for updates)
   * @param idField field name of the ID (default: 'id')
   * @param extraWhere optional additional conditions (for example, { workspaceId: '...' })
   */
  async validate<T extends ObjectLiteral, K extends keyof T>(
    repository: Repository<T>,
    field: K,
    value: T[K],
    excludeId?: string,
    idField: keyof T = 'id' as keyof T,
    extraWhere?: FindOptionsWhere<T>,
  ): Promise<void> {
    const where: FindOptionsWhere<T> = {
      [field]: value,
      ...extraWhere,
    } as FindOptionsWhere<T>;
    const existing = await repository.findOne({ where });
    if (
      existing &&
      (excludeId ? String(existing[idField]) !== String(excludeId) : true)
    ) {
      const entityName = repository.metadata.name;
      throw new ConflictException(
        `${entityName} with ${String(field)} "${value}" already exists`,
      );
    }
  }
}
