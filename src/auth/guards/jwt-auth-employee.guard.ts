import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthEmployeeGuard extends AuthGuard('jwt-employee') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  async canActivate(context: ExecutionContext) {
    // 🔐 أول شي تحقق JWT
    const can = await super.canActivate(context);
    if (!can) return false;

    // 📥 جيب الصلاحيات المطلوبة من decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    // إذا ما في صلاحيات مطلوبة → اسمح
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = this.getRequest(context);
    const user = request.user;

    // تأكد أن user فيه permissions
    if (!user || !user.permissions) {
      throw new ForbiddenException('No permissions found');
    }

    // تحقق من الصلاحيات
    const hasPermission = requiredPermissions.every((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('ليس لديك الصلاحية');
    }

    return true;
  }
}
