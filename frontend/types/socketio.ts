export enum GameState {
	BeforeInit,
	Initiated,
	Started,
	Completed
}

export enum PlinkoDirection {
	Left = 'LEFT',
	Right = 'RIGHT',
}

export type PlinkoCompleteInput = {
	gameId: string,
}

export type PlinkoStartInput = {
	bet: number,
}

type PlinkoCompleteMessageData = {
	balance: number;
}

export type PlinkoCompleteMessage = ISocketMessage<PlinkoCompleteMessageData>;

type PlinkoStartMessageData = {
	_id: string,
	bet: number,
	win: number,
	multiplier: number,
	pattern: PlinkoDirection[]
}

export type PlinkoStartMessage = ISocketMessage<PlinkoStartMessageData>;

type PlinkoInitMessageData = {
	_id: string,
	bets: number[],
	multipliers: number[],
	bet?: number,
	win?: number,
	multiplier?: number,
	pattern?: PlinkoDirection[]
}

export type PlinkoInitMessage = ISocketMessage<PlinkoInitMessageData>;

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