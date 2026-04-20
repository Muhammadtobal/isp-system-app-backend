import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthEmployeeAdminGuard extends AuthGuard([
  'jwt-admin',
  'jwt-employee',
]) {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
