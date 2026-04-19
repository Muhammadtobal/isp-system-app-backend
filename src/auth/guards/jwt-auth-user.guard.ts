import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthUserGuard extends AuthGuard('jwt-user') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
