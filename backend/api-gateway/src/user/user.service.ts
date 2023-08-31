import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { balanceResolverPubSub } from './user.resolver';

@Injectable()
export class UserService implements OnModuleInit {
  constructor() {}

  async onModuleInit(): Promise<any> {
    const topic = 'user_balance_changed';

    const kafka = new Kafka({
      clientId: 'balance-user-gateway-id',
      brokers: ['broker:29092'],
    });

    const consumer = kafka.consumer({
      groupId: 'balance-user-gateway-id-consumer',
    });

    await consumer.connect();
    await consumer.subscribe({
      topic,
      fromBeginning: false,
    });

    await consumer.run({
      partitionsConsumedConcurrently: 1,
      eachMessage: async ({ message }) => {
        const msg = message.value.toString();
        await this.handleUserBalanceChanged(JSON.parse(msg));
      },
    });
  }

  async handleUserBalanceChanged({ userId, balance }) {
    await balanceResolverPubSub.publish('balanceUpdated', {
      userBalance: { userId, balance },
    });
  }
}
