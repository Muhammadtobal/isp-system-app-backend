import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthAdminGuard extends AuthGuard("jwt-admin") {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
