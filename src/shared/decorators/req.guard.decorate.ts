import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../helpers';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
