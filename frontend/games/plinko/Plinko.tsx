import {FunctionComponent, useCallback, useEffect, useMemo, useState} from "react";
import {Container, Sprite, Stage} from "@pixi/react";
import {BottomBar} from "@/games/plinko/BottomBar/BottomBar";
import {Multipliers} from "@/games/plinko/Multipliers/Multipliers";
import {Ball} from "@/games/plinko/Ball/Ball";
import {GameState, PlinkoDirection, PlinkoInitMessage, PlinkoStartMessage} from "@/types/socketio";
import {plinkoSocket as socket} from "@/components/socketio/socket";
import useAuth from "@/context/authContext";
import {Loading} from "@/components/common/Loading";

type Props = { width: number; height: number };

export const bottomBarHeight = 120;

export const bumperSize = 35;
export const spacingX = 70;
const spacingY = 25;

const pattern = [
	PlinkoDirection.Left,
	PlinkoDirection.Right,
	PlinkoDirection.Left,
	PlinkoDirection.Right,
	PlinkoDirection.Left,
	PlinkoDirection.Right,
	PlinkoDirection.Right,
	PlinkoDirection.Right,
]

export const Plinko: FunctionComponent<Props> = ({width, height}) => {
	const {user} = useAuth();

	const [gameState, setGameState] = useState<GameState>(GameState.BeforeInit);
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [bets, setBets] = useState<number[]>([]);
	const [selectedBet, setSelectedBet] = useState<number>(0);
	const [pattern, setPattern] = useState<PlinkoDirection[] | null>(null);
	const [gameId, setGameId] = useState<string>('');
	const [multipliers, setMultipliers] = useState<number[]>([]);
	const [win, setWin] = useState<number>(0);

	const stageHeight = useMemo(() => height - bottomBarHeight, [height]);

	const containerBounds = useMemo(() => {
		return Array.from({length: 8}).map((_, i) => {
			return 0.1 * stageHeight + i * bumperSize + (i * spacingY)
		})
	}, [stageHeight])

	const mid = width / 2 - bumperSize / 2;

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

	const onInit = useCallback(({message}: PlinkoInitMessage) => {
		setBets(message.bets);
		setMultipliers(message.multipliers);
		if (message.bet) {
			const {bet, win, pattern} = message;
			setSelectedBet(bet);
			setGameState(GameState.Started);
			setGameId(message._id || '');
			setPattern(pattern || null);
		} else {
			setSelectedBet(message.bets[0]);
			setGameState(GameState.Initiated);
		}
	}, []);

	const start = useCallback(() => {
		socket.emit<'start'>('start', {
			bet: selectedBet
		})
	}, [selectedBet]);

	const onStart = useCallback(({message}: PlinkoStartMessage) => {
		const {_id, pattern, win} = message;

		setGameState(GameState.Started);
		setGameId(_id);
		setWin(win);
		setPattern(pattern);
	}, []);

	const complete = useCallback(() => {
		socket.emit<'complete'>('complete', {
			gameId
		})
	}, [gameId])

	const onComplete = useCallback(() => {
		setGameState(GameState.Completed);
		setPattern(null);
	}, [])

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
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('init', onInit);
			socket.off('start', onStart);
			socket.off('complete', onComplete);
		};
	}, [isConnected, gameState, onConnect, onDisconnect, user, onInit, onStart, onComplete]);

	if (gameState === GameState.BeforeInit) {
		return (
			<div className='w-full h-full flex justify-center items-center'>
				<Loading/>
			</div>
		)
	}

	return (
		<div className='relative w-full h-full'>
			<Stage width={width} height={stageHeight}>
				{
					pattern && gameState === GameState.Started && (
						<Ball
							width={width}
							height={stageHeight}
							size={bumperSize / 2}
							containersBounds={containerBounds}
							pattern={pattern}
							complete={complete}
						/>
					)
				}
				{
					Array.from({length: 8}).map((_, i) => {
						const y = 0.1 * stageHeight + i * bumperSize + (i * spacingY);
						const x = (mid - (i * (spacingX / 2)) - (bumperSize / 2) * i);

						return (
							<Container
								key={`bumper-container-${i}`}
								anchor={{y: 0, x: 0.5}}
								y={y}
								x={x}
								height={bumperSize}
							>
								{
									Array.from({length: i + 1}).map((_, j) => {
										return (<Sprite
											key={`bumper-${i}-${j}`}
											image='/img/plinko/bumper.png'
											width={bumperSize}
											height={bumperSize}
											x={j * bumperSize + (j * spacingX)}
										/>)
									})
								}
							</Container>
						)

					})
				}
				<Container width={width}>
					<Multipliers height={stageHeight} width={width} multipliers={multipliers.sort((a, b) => b - a)}/>
				</Container>
			</Stage>
			<BottomBar bets={bets} win={win} setSelectedBet={setSelectedBet} selectedBet={selectedBet} start={start}
			           gameState={gameState}/>
		</div>
	);
};