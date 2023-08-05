import { HttpStatus } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsResponse } from '@nestjs/websockets';

export class GameWsResponse implements WsResponse {
  data: { status: HttpStatus; message: string };

  constructor(public readonly event: string, message: any, status: HttpStatus) {
    this.data = { message, status };
  }
}

export class GameWsException {
  constructor(
    public readonly message: string[] | string,
    public readonly status: HttpStatus,
    public readonly client: Socket,
    private readonly disconnect: boolean = false,
  ) {
    this.client.emit('exception', {
      message: Array.isArray(message) ? message : [message],
      status,
    });

    disconnect && this.client.disconnect(true);
  }
}
