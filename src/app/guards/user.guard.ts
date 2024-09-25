import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public';
import { DataSource } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { Roles } from '../enums/common.enum';
import { REQUEST_ACCESS_USER_TYPE } from '../decorators/allow-acess';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  // @ts-ignore
  async handleRequest(err, user, info, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const accessTypes = this.reflector.getAllAndOverride<Roles[]>(REQUEST_ACCESS_USER_TYPE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const role = await this.dataSource
      .getRepository(Role)
      .createQueryBuilder('role')
      .innerJoin('role.roleUsers', 'roleUsers')
      .where('roleUsers.id = :userId', { userId: user.id })
      .getOne();

    if (!accessTypes || accessTypes.includes(role.code as Roles)) {
      return user;
    }

    throw new ForbiddenException();
  }
}
