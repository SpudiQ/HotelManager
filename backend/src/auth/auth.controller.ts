import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService, SanitizedUser } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: SanitizedUser }) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    const user = await this.userService.create({
      email: createUserDto.email,
      passwordHash: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      workspaceId: createUserDto.workspaceId,
      role: createUserDto.role ?? UserRole.GUEST,
    });
    const { passwordHash: _pw, ...result } = user;
    return result;
  }
}
