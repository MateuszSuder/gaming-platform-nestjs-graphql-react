import { Context, Resolver, Subscription } from '@nestjs/graphql';
import { UserBalanceModel } from './models/userBalance.model';
import { PubSub } from 'graphql-subscriptions';
import { Inject, Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ClientKafka } from '@nestjs/microservices';

export const balanceResolverPubSub = new PubSub();

@Resolver()
export class UserResolver implements OnModuleInit {
  private readonly logger = new Logger('User resolver');

  constructor(
    @Inject('BALANCE_SERVICE') private readonly balanceService: ClientKafka,
  ) {}

  async onModuleInit(): Promise<any> {}

  @UseGuards(AuthGuard)
  @Subscription((returns) => UserBalanceModel, {
    filter: (payload, variables, context) => {
      console.log(payload);
      return payload.userBalance.userId === context.req.userId;
    },
  })
  userBalance(@Context() { req }: any) {
    return balanceResolverPubSub.asyncIterator('balanceUpdated');
  }
}
