import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_FIRST_NAME,
  DEFAULT_ADMIN_LAST_NAME,
} from './constants';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const users = await this.userService.findAll();
    if (users.length === 0) {
      const adminEmail = this.configService.get<string>(
        'ADMIN_EMAIL',
        DEFAULT_ADMIN_EMAIL,
      );
      const adminPassword = this.configService.get<string>(
        'ADMIN_PASSWORD',
        DEFAULT_ADMIN_PASSWORD,
      );
      await this.userService.create({
        email: adminEmail,
        passwordHash: adminPassword,
        firstName: DEFAULT_ADMIN_FIRST_NAME,
        lastName: DEFAULT_ADMIN_LAST_NAME,
        role: UserRole.SUPERADMIN,
        workspaceId: null,
      });
      console.log('Суперадмин создан');
    } else {
      console.log('Пользователи уже существуют, seeding пропущен');
    }
  }
}
