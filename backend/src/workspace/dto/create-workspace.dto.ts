import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}
