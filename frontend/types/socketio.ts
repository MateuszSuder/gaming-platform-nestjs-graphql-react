export enum GameState {
	BeforeInit,
	Initiated,
	Started,
	Completed
}

export type ThreeCardsMonteStartMessageData = {
	_id: string;
	winningCard: number;
	win: number;
}

export type ThreeCardsMonteStartMessage = ISocketMessage<ThreeCardsMonteStartMessageData>

export type ThreeCardsMonteStartInput = {
	bet: number,
	cardNumber: 0 | 1 | 2;
}

export type ThreeCardsMonteInitMessageData = {
	bets: number[],
	_id: string,
	bet?: number,
	win?: number,
	winningCard?: number;
}

export type ThreeCardsMonteInitMessage = ISocketMessage<ThreeCardsMonteInitMessageData>

export interface ISocketMessage<T> {
	message: T,
	status: number
}