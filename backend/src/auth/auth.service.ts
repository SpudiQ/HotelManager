import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/entities/user.entity';

export interface SanitizedUser {
  id: string;
  email: string;
  role: UserRole;
  workspaceId: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<SanitizedUser | null> {
    const user = await this.userService.validateUser(email, password);
    if (user) {
      const { passwordHash: _pw, ...result } = user;
      return result as SanitizedUser;
    }
    return null;
  }

  login(user: SanitizedUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
