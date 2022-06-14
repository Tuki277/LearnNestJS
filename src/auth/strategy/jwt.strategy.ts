import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../contants';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'auth'
  ) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // console.log("🚀 ~ file: jwt.strategy.ts ~ line 20 ~ validate ~ payload", payload)

    return { _id: payload.id };
  }
}