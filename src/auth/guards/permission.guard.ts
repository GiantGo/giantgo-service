import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';

function isString(value: any) {
  return typeof value === 'string';
}

type Permissions = string | string[] | string[][];

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    const permissions = user.roles
      .map((r: Role) => (r.permissions || []).map((p: Permission) => p.slug))
      .flat();

    let required = this.reflector.get<Permissions>(
      'permissions',
      context.getHandler(),
    );

    if (isString(required)) {
      required = [[required as string]];
    } else if (
      Array.isArray(required) &&
      (required as string[][]).every(isString)
    ) {
      required = [required as string[]];
    }

    const sufficient = (required as string[][]).some((required) =>
      required.every((permission) => permissions.indexOf(permission) !== -1),
    );

    if (!sufficient) {
      throw new ForbiddenException('访问被拒绝');
    }

    return sufficient;
  }
}

export const Permissions = (permissions: Permissions) =>
  SetMetadata('permissions', permissions);
