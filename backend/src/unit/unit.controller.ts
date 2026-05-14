import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('units')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPERADMIN)
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  findAll(@Query('propertyId') propertyId?: string) {
    return this.unitService.findAll(propertyId);
  }

  @Get(':identifier')
  findOne(@Param('identifier') identifier: string) {
    return this.unitService.findByIdOrSlug(identifier);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }
}
