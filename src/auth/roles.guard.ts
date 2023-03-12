import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CargoException } from 'src/models/cargo.exception';
import { CargoReturenCode } from 'src/models/cargo.model';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private hierarchy = 'admin > user';

  canActivate(context: ExecutionContext): boolean {
    const hierarchyList = this.hierarchy.split('>').map((role) => role.trim());

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const requiredRolesMapIndex = requiredRoles
      .map((role) => hierarchyList.indexOf(role))
      .filter((role) => role >= 0);

    const { user } = context.switchToHttp().getRequest();

    const userRoles: string[] = user.roles;

    const userRolesMapIndex = userRoles
      .map((role) => hierarchyList.indexOf(role))
      .filter((role) => role >= 0);

    const isValid =
      Math.min(...userRolesMapIndex) <= Math.max(...requiredRolesMapIndex);

    if (!isValid) throw new CargoException(CargoReturenCode.FORBIDDEN);

    return true;
  }
}
