import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { VerifyCommand } from '../authorization/commands/impl/verify.command';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly commandBus: CommandBus) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(ctx);
    const { req, extra } = context.getContext();
    const token = extra?.token || req?.cookies?.token;

    const res = await this.commandBus.execute(new VerifyCommand(token));

    req.userId = res.id;

    return !!res?.id;
  }
}
