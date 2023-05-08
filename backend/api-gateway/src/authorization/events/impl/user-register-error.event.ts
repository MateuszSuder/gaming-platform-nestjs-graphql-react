import { Logger } from '@nestjs/common';

export class UserRegisterErrorEvent {
  private readonly logger = new Logger('Register Event Error');

  constructor() {
    this.logger.log('Instance initiated');
  }
}
