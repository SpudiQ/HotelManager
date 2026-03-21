import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Controller } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('workspace')
export class WorkspaceController {}
