import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type User = {
  id: string;
};

export const ActorId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as User;

    return user.id;
  },
);
