import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoryListCommand } from '../impl/categoryList.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CategoryModel } from '../../models/category.model';

@CommandHandler(CategoryListCommand)
export class CategoryListHandler
  implements ICommandHandler<CategoryListCommand>, OnModuleInit
{
  private readonly logger = new Logger('Category list handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.gameClient.subscribeToResponseOf('category_list');
    await this.gameClient.connect();
  }

  async execute(command: CategoryListCommand): Promise<CategoryModel[]> {
    this.logger.log('Getting list of categories');

    try {
      return await firstValueFrom<CategoryModel[]>(
        this.gameClient.send('category_list', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
