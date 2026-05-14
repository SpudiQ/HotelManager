import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { CommonModule } from '../common/common.module';
import { PropertyModule } from '../property/property.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unit]),
    CommonModule,
    PropertyModule,
    StorageModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService],
})
export class UnitModule {}
