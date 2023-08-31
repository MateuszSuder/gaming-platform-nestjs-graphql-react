import {
	PlinkoCompleteInput,
	PlinkoCompleteMessage,
	PlinkoInitMessage,
	PlinkoStartInput,
	PlinkoStartMessage,
	SevenFruitsCompleteInput,
	SevenFruitsCompleteMessage,
	SevenFruitsInitMessage,
	SevenFruitsStartInput,
	SevenFruitsStartMessage
} from "@/types/socketio";
import {io, Socket} from 'socket.io-client';

'use-client';

interface SevenFruitsClientToServerEvents {
	init: () => void;
	start: (message: SevenFruitsStartInput) => void;
	complete: (message: SevenFruitsCompleteInput) => void;
}

interface SevenFruitsServerToClientEvents {
	init: (message: SevenFruitsInitMessage) => void;
	start: (message: SevenFruitsStartMessage) => void;
	complete: (message: SevenFruitsCompleteMessage) => void;
}

interface PlinkoClientToServerEvents {
	init: () => void;
	start: (message: PlinkoStartInput) => void;
	complete: (message: PlinkoCompleteInput) => void;
}

interface PlinkoServerToClientEvents {
	init: (message: PlinkoInitMessage) => void;
	start: (message: PlinkoStartMessage) => void;
	complete: (message: PlinkoCompleteMessage) => void;
}

export const threeCardsMonteSocket = io('http://localhost:8080/three-cards-monte');
export const sevenFruitsSocket: Socket<SevenFruitsServerToClientEvents, SevenFruitsClientToServerEvents> = io('http://localhost:8080/seven-fruits');

export const plinkoSocket: Socket<PlinkoServerToClientEvents, PlinkoClientToServerEvents> = io('http://localhost:8080/plinko');