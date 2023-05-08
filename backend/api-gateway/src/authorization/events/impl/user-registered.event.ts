import { Logger } from '@nestjs/common';

export class UserRegisteredEvent {
  private readonly logger = new Logger('Register Event');

  constructor(public readonly userId: string, public readonly username) {
    this.logger.log('Instance initiated');
  }
}
