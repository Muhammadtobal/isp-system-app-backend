import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthUserEmployeeGuard extends AuthGuard([
  'jwt-employee',
  'jwt-user',
]) {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
