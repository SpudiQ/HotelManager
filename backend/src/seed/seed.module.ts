import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [SeedService],
})
export class SeedModule {}
