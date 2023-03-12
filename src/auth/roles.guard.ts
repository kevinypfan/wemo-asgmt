import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CargoException } from 'src/models/cargo.exception';
import { CargoReturenCode } from 'src/models/cargo.model';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const isValid = requiredRoles.some((role) => user.roles?.includes(role));

    if (!isValid) throw new CargoException(CargoReturenCode.FORBIDDEN);

    return isValid;
  }
}
