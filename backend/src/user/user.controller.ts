import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(':id/role')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.userService.updateRole(id, role);
  }
}
