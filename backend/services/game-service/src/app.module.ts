import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreeCardsMonteModule } from './three-cards-monte/three-cards-monte.module';
import { ConfigModule } from './config/config.module';
import { SevenFruitsModule } from './seven-fruits/seven-fruits.module';

@Module({
  imports: [ThreeCardsMonteModule, ConfigModule, SevenFruitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
