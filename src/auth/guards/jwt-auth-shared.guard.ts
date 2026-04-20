import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthSharedGuard extends AuthGuard([
  'jwt-employee',
  'jwt-admin',
  'jwt-user',
]) {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
