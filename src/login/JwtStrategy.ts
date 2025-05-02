import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';


export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Usa variables de entorno en producción
    });
  }
  async validate(payload: any) {
    console.log('Payload:', payload);
    return { 
      userId: payload.sub, 
      username: payload.username,
      roles: payload.roles 
    };
  }
}