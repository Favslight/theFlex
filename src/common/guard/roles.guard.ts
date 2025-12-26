import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum.common';
import { IS_PUBLIC_KEY } from '../decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    this.logger.log(`checking if ${userRole} can access endpoint`);
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const RequiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || !RequiredRoles) {
      return true;
    }

    const { user } = await context.switchToHttp().getRequest();

    return this.matchRoles(RequiredRoles, user?.role);
  }
}
