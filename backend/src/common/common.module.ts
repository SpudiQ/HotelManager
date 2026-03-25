import { Module } from '@nestjs/common';
import { UniquenessValidator } from './validators/uniqueness.validator';

@Module({
  providers: [UniquenessValidator],
  exports: [UniquenessValidator],
})
export class CommonModule {}
