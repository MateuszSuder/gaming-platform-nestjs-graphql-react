export enum GameState {
	BeforeInit,
	Initiated,
	Started,
	Completed
}

export type SevenFruitsCompleteInput = {
	gameId: string,
}

export type SevenFruitsStartInput = {
	bet: number,
}

export enum FruitsSlotSymbol {
	SEVEN = '7',
	WATERMELON = 'Watermelon',
	STRAWBERRY = 'Strawberry',
	PINEAPPLE = 'Pineapple',
	GRAPE = 'Grape',
	APPLE = 'Apple',
	BANANA = 'Banana',
}

export interface IGameResult {
	bet: number,
	win: number,
	winningLines: number[][][],
	symbols: FruitsSlotSymbol[][]
}

type SevenFruitsCompleteMessageData = {
	balance: number;
}

export type SevenFruitsCompleteMessage = ISocketMessage<SevenFruitsCompleteMessageData>;

type SevenFruitsStartMessageData = {
	_id: string;
	gameResult: IGameResult;
}

export type SevenFruitsStartMessage = ISocketMessage<SevenFruitsStartMessageData>;

type SevenFruitsInitMessageData = {
	bets: number[],
	_id?: string,
	gameResult: IGameResult
}

export type SevenFruitsInitMessage = ISocketMessage<SevenFruitsInitMessageData>;

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