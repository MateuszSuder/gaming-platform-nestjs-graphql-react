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
import { ThreeCardsMonteInitCommand } from './commands/impl/three-cards-monte-init.command';
import { ThreeCardsMonteStartCommand } from './commands/impl/three-cards-monte-start.command';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';
import { ThreeCardsMonteCompleteCommand } from './commands/impl/three-cards-monte-complete.command';

enum Events {
  Init = 'init',
  Start = 'start',
  Complete = 'complete',
}

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
  namespace: 'three-cards-monte',
})
export class ThreeCardsMonteGateway implements OnGatewayConnection {
  private readonly logger = new Logger('Three cards monte gateway');

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

  @SubscribeMessage(Events.Init)
  async init(@ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
    this.logger.log(`Got init for ${client.data.user.id}`);

    try {
      const initValue = await this.commandBus.execute(
        new ThreeCardsMonteInitCommand(client.data.user.id),
      );

      return new GameWsResponse(Events.Init, initValue, HttpStatus.OK);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  @SubscribeMessage(Events.Start)
  async start(
    @ConnectedSocket() client: Socket,
    @MessageBody() startInput: StartDto,
  ): Promise<WsResponse<any> | GameWsException> {
    const { bet, cardNumber } = startInput;

    this.logger.log(
      `Got start for ${client.data.user.id} with bet ${bet} and card ${cardNumber}`,
    );

    try {
      const initValue = await this.commandBus.execute(
        new ThreeCardsMonteStartCommand(client.data.user.id, bet, cardNumber),
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
    const { gameId } = completeInput;
    const userId = client.data.user.id;

    try {
      const completeValue = await this.commandBus.execute(
        new ThreeCardsMonteCompleteCommand(gameId, userId),
      );

      return new GameWsResponse(Events.Complete, completeValue, HttpStatus.OK);
    } catch (e) {
      const { message, statusCode } = e;
      return new GameWsException(message, statusCode, client);
    }
  }
}
