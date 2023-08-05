import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger('App service');
  constructor(private configService: ConfigService) {}

  gameList() {
    this.logger.log('Returning list of games');
    return this.configService.getGameList();
  }

  categoryList() {
    return this.configService.getCategories();
  }
}
