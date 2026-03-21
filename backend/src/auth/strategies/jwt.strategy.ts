import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SanitizedUser } from '../auth.service';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'default-secret-key'),
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    role: string;
    workspaceId: string;
  }): SanitizedUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
      workspaceId: payload.workspaceId,
    };
  }
}
