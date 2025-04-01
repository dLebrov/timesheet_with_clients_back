import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { usersDto } from 'src/swagger-dto/users.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'megaSuperSecret',
    });
  }

  async validate(payload: usersDto) {
    const { email, id, name, surname, username } = payload;

    return { email, id, name, surname, username };
  }
}
