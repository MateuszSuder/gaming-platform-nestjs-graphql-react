import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { HttpStatus, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { GameWsException, GameWsResponse } from '../shared/game-ws-response';
import { VerifyCommand } from '../../authorization/commands/impl/verify.command';
import { Events } from '../enums/events.enum';
import { SevenFruitsInitCommand } from './commands/impl/seven-fruits-init.command';
import { StartDto } from './dto/start.dto';
import { SevenFruitsStartCommand } from './commands/impl/seven-fruits-start.command';
import { CompleteDto } from './dto/complete.dto';
import { SevenFruitsCompleteCommand } from './commands/impl/seven-fruits-complete.command';

@UsePipes(
  new ValidationPipe({
    exceptionFactory(validationErrors = []) {
      if (this.isDetailedOutputDisabled) {
        return new WsException('Bad request');
      }
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsException({
        message: errors,
        status: HttpStatus.BAD_REQUEST,
      });
    },
  }),
)
@WebSocketGateway({
  namespace: 'seven-fruits',
})
export class SevenFruitsGateway implements OnGatewayConnection {
  private readonly logger = new Logger('Seven fruits gateway');

  @SubscribeMessage(Events.Init)
  async init(@ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
    await this.waitForAuth(client, 3);

    this.logger.log(`Got init for ${client.data.user.id}`);

    try {
      const initValue = await this.commandBus.execute(
        new SevenFruitsInitCommand(client.data.user.id),
      );

      return new GameWsResponse(Events.Init, initValue, HttpStatus.OK);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  constructor(private readonly commandBus: CommandBus) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = parse(client.handshake.headers.cookie).token;
    if (!token)
      return new GameWsException(
        'Unauthorized',
        HttpStatus.UNAUTHORIZED,
        client,
        true,
      );

    try {
      client.data.user = await this.commandBus.execute(
        new VerifyCommand(token),
      );
    } catch (e) {
      return new GameWsException(
        'Unauthorized',
        HttpStatus.UNAUTHORIZED,
        client,
        true,
      );
    }
  }

  async waitForAuth(client: Socket, retries: number) {
    if (!client.data.user?.id && retries) {
      await new Promise((r) => setTimeout(r, 1000));

      this.logger.warn(`No user found, retrying... Retries left: ${retries}`);

      --retries;

      await this.waitForAuth(client, retries);
    }
  }

  @SubscribeMessage(Events.Start)
  async start(
    @ConnectedSocket() client: Socket,
    @MessageBody() startInput: StartDto,
  ): Promise<WsResponse<any> | GameWsException> {
    await this.waitForAuth(client, 3);
    const { bet } = startInput;

    this.logger.log(`Got start for ${client.data.user.id} with bet ${bet}`);

    try {
      const initValue = await this.commandBus.execute(
        new SevenFruitsStartCommand(client.data.user.id, bet),
      );

      return new GameWsResponse(Events.Start, initValue, HttpStatus.OK);
    } catch (e) {
      const { message, statusCode } = e;
      return new GameWsException(message, statusCode, client);
    }
  }

  @SubscribeMessage(Events.Complete)
  async complete(
    @ConnectedSocket() client: Socket,
    @MessageBody() completeInput: CompleteDto,
  ): Promise<GameWsResponse | GameWsException> {
    await this.waitForAuth(client, 3);
    const { gameId } = completeInput;
    const userId = client.data.user.id;

    try {
      const completeValue = await this.commandBus.execute(
        new SevenFruitsCompleteCommand(gameId, userId),
      );

      return new GameWsResponse(Events.Complete, completeValue, HttpStatus.OK);
    } catch (e) {
      const { message, statusCode } = e;
      return new GameWsException(message, statusCode, client);
    }
  }
}
