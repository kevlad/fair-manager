import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/role.constants';
import { AuthenticatedUser } from '../../modules/auth/types/authenticated-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;
    const { user } = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
