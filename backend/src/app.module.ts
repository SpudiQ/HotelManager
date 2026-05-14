import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { PropertyModule } from './property/property.module';
import { UnitModule } from './unit/unit.module';
import { UploadModule } from './upload/upload.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    // CDN-MIGRATION: снять при переезде на Yandex Cloud Object Storage —
    // статика будет отдаваться напрямую с CDN
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    CommonModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    PropertyModule,
    UnitModule,
    UploadModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
