import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthUserAdminGuard extends AuthGuard([
  'jwt-admin',
  'jwt-user',
]) {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
