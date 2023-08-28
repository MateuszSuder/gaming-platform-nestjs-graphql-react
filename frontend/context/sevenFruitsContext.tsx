'use client'

import {
	createContext,
	Dispatch,
	FunctionComponent,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react";
import {GameState, SevenFruitsInitMessage, SevenFruitsStartMessage} from "@/types/socketio";
import {sevenFruitsSocket as socket} from "@/components/socketio/socket";
import useAuth from "@/context/authContext";
import {Socket} from "socket.io-client";

interface ISevenFruitsProvider {
	bets: number[];
	gameState: GameState,
	isConnected: boolean,
	socket: Socket,
	selectedBet: number,
	setSelectedBet?: Dispatch<number>,
	symbols: string[][];
	nextSymbols: string[][];
	win: number;
	start?: () => void
	complete?: () => void
}

const SevenFruitsContext = createContext<ISevenFruitsProvider>({
	bets: [],
	gameState: GameState.BeforeInit,
	isConnected: false,
	socket: socket,
	selectedBet: 0,
	symbols: [],
	nextSymbols: [],
	win: 0
})

type Props = {
	children: ReactNode
}

export const symbolList = [
	{
		name: '7',
		path: 'seven.png'
	},
	{
		name: 'Watermelon',
		path: 'watermelon.png'
	},
	{
		name: 'Strawberry',
		path: 'strawberry.png'
	},
	{
		name: 'Pineapple',
		path: 'pineapple.png'
	},
	{
		name: 'Grape',
		path: 'grape.png'
	},
	{
		name: 'Banana',
		path: 'banana.png'
	},
	{
		name: 'Apple',
		path: 'apple.png'
	},
] as const;

const getRandomSymbol = (): (typeof symbolList)[number]['path'] => {
	const rand = Math.floor(Math.random() * ((symbolList.length - 1)));
	return symbolList[rand].path;
}

const getRandomSymbols = (): string[][] => {
	const res: string[][] = [];

	for (let i = 0; i < 3; i++) {
		res.push([]);
		for (let j = 0; j < 3; j++) {
			res[i].push(getRandomSymbol())
		}
	}

	return res;
}

const mapNameToPath = (name: string) => {
	return symbolList.find(symbol => symbol.name === name)?.path || '';
}

export const SevenFruitsProvider: FunctionComponent<Props> = ({children}) => {
	const {user, loading} = useAuth();

	const [gameState, setGameState] = useState<GameState>(GameState.BeforeInit);
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [bets, setBets] = useState<number[]>([]);
	const [selectedBet, setSelectedBet] = useState<number>(0);
	const [nextSymbols, setNextSymbols] = useState<string[][]>(getRandomSymbols);
	const [symbols, setSymbols] = useState<string[][]>(getRandomSymbols);
	const [gameId, setGameId] = useState<string>('');
	const [win, setWin] = useState(0);

	const initGame = useCallback(() => {
		if (gameState === GameState.BeforeInit) {
			socket.emit('init');
		}
	}, [gameState])

	const onConnect = useCallback(() => {
		setIsConnected(true);
		initGame();
	}, [initGame]);

	const onDisconnect = useCallback(() => {
		setIsConnected(false);
	}, []);

	const onInit = useCallback(({message}: SevenFruitsInitMessage) => {
		setBets(message.bets);
		if (message.gameResult) {
			const {bet, symbols, win} = message.gameResult;
			setSelectedBet(bet);
			setNextSymbols(
				symbols.map(row => row.map(symbol => mapNameToPath(symbol)))
			);
			setGameState(GameState.Started);
			setGameId(message._id || '')
		} else {
			setSelectedBet(message.bets[0]);
			setGameState(GameState.Initiated);
		}
	}, []);

	const start = useCallback(() => {
		socket.emit<'start'>('start', {
			bet: selectedBet
		})
	}, [selectedBet])

	const onStart = useCallback(({message}: SevenFruitsStartMessage) => {
		const {_id, gameResult} = message;
		const {win, symbols} = gameResult;

		setGameState(GameState.Started);
		setGameId(_id);
		setWin(win);
		setNextSymbols(
			symbols.map(row => row.map(symbol => mapNameToPath(symbol)))
		);
	}, []);

	const complete = useCallback(() => {
		socket.emit<'complete'>('complete', {
			gameId
		})
	}, [gameId])

	const onComplete = useCallback(() => {
		setGameState(GameState.Completed);
		setSymbols(nextSymbols);
	}, [nextSymbols])

	useEffect(() => {
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('init', onInit);
		socket.on('start', onStart);
		socket.on('complete', onComplete);

		if ((gameState === GameState.BeforeInit) && !!user) {
			!isConnected && socket.connect();
		}

		return () => {
			isConnected && socket.disconnect();

			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('init', onInit);
			socket.off('start', onStart);
			socket.off('complete', onComplete);
		};
	}, [isConnected, gameState, onConnect, onDisconnect, user, onInit, onStart, onComplete]);

	return (
		<SevenFruitsContext.Provider value={{
			bets,
			gameState,
			isConnected,
			socket,
			selectedBet,
			setSelectedBet,
			symbols,
			nextSymbols,
			win,
			complete,
			start
		}}>
			{
				!loading && (gameState !== GameState.BeforeInit) && children
			}
		</SevenFruitsContext.Provider>
	)
}

export default function useSevenFruits() {
	return useContext(SevenFruitsContext);
}