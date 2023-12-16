import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new InternalServerErrorException('User not found');
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
