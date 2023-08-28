import {
	SevenFruitsCompleteInput,
	SevenFruitsCompleteMessage,
	SevenFruitsInitMessage,
	SevenFruitsStartInput,
	SevenFruitsStartMessage
} from "@/types/socketio";
import {io, Socket} from 'socket.io-client';

'use-client';

interface ClientToServerEvents {
	init: () => void;
	start: (message: SevenFruitsStartInput) => void;
	complete: (message: SevenFruitsCompleteInput) => void;
}

interface ServerToClientEvents {
	init: (message: SevenFruitsInitMessage) => void;
	start: (message: SevenFruitsStartMessage) => void;
	complete: (message: SevenFruitsCompleteMessage) => void;
}

export const threeCardsMonteSocket = io('http://localhost:8080/three-cards-monte');
export const sevenFruitsSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:8080/seven-fruits');