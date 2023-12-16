import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!validRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(
        `User ${user.email} needs a valid role: [${validRoles.join(
          ', ',
        )}] but has [${user.roles.join(', ')}]`,
      );
    }

    return true;
  }
}
