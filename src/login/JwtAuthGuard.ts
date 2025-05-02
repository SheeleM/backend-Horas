import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(private reflector: Reflector) {
        super();
      }
    
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('your-secret-key', [
          context.getHandler(),
          context.getClass(),
        ]);
    
        if (isPublic) {
          return true;
        }
        console.log('JwtAuthGuard: canActivate', context);
        return super.canActivate(context);
      }
}