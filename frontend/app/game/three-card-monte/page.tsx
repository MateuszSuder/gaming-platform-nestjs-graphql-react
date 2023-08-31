'use client';

import Image from "next/image";
import {FunctionComponent, useCallback, useEffect, useMemo, useState} from "react";
import {threeCardsMonteSocket as socket} from "@/components/socketio/socket";
import {
	GameState,
	ThreeCardsMonteInitMessage,
	ThreeCardsMonteStartInput,
	ThreeCardsMonteStartMessage
} from "@/types/socketio";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {Loading} from "@/components/common/Loading";
import useAuth from "@/context/authContext";

type CardProps = {
	id: 0 | 1 | 2;
	isActive: boolean;
	setActiveCard: (cardNumber: CardProps['id']) => void;
	front?: boolean;
	isWinning?: boolean;
}

const Card: FunctionComponent<CardProps> = ({id, isActive, setActiveCard, front = false, isWinning = false}) => {
	const getCardImg = useMemo(() => {
		const mainPath = '/img/three-cards-monte/';

		if (front) {
			return `${mainPath}card-front-${isWinning ? 'queen' : 'jack'}.png`;
		} else {
			return `${mainPath}card-back.webp`;
		}
	}, [front, isWinning])

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={getCardImg} alt={`card-${id}`}
			className={`object-contain cursor-pointer hover:scale-105 duration-300 ${isActive && 'scale-105'}`}
			onClick={() => setActiveCard(id)}
		/>
	)
}

export default function ThreeCardMonte() {
	const {user, loading: userLoading} = useAuth();

	const [err, setErr] = useState<boolean>(false);
	const [activeCard, setActiveCard] = useState<0 | 1 | 2 | null>(null);
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [bets, setBets] = useState<number[]>([]);
	const [selectedBet, setSelectedBet] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [win, setWin] = useState<number | null>(null);
	const [winningCard, setWinningCard] = useState<number | null>(null)
	const [gameState, setGameState] = useState<GameState>(GameState.BeforeInit);

	const betIndex = bets.indexOf(selectedBet);

	const initGame = useCallback(() => {
		if (gameState === GameState.BeforeInit) {
			socket.emit('init');
		}
	}, [gameState])

	function onInit({message}: ThreeCardsMonteInitMessage) {
		setBets(message.bets);
		setSelectedBet(message.bets[0]);
		setLoading(false);

		if (message.win !== undefined && message.winningCard !== undefined) {
			setGameState(GameState.Started);
			setWin(message.win);
			setWinningCard(message.winningCard);

			socket.emit('complete', {
				gameId: message._id
			});
		} else {
			setGameState(GameState.Initiated)
		}
	}

	const onStart = ({message}: ThreeCardsMonteStartMessage) => {
		setWinningCard(message.winningCard);
		setWin(message.win);
		setGameState(GameState.Started);

		socket.emit('complete', {
			gameId: message._id
		});
	}

	const onComplete = () => {
		setGameState(GameState.Completed);
	}

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
			initGame();
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		console.log(socket.connected);
		console.log(isConnected);

		!socket.connected && socket.connect();

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('init', onInit);
		socket.on('start', onStart);
		socket.on('complete', onComplete);

		return () => {
			setIsConnected(false);
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('init', onInit);
			socket.off('start', onStart);
			socket.off('complete', onComplete);
		};
	}, [initGame, isConnected]);

	const onSubmit = () => {
		if (activeCard === null) {
			setErr(true)
			return;
		}

		const input: ThreeCardsMonteStartInput = {
			cardNumber: activeCard,
			bet: selectedBet
		}

		socket.emit('start', input)
	}

	const reset = () => {
		setActiveCard(null);
		setWinningCard(null);
		setWin(null);
		setGameState(GameState.Initiated);
	}

	const setActiveCardHandler = (cardNumber: CardProps['id']) => {
		setActiveCard(cardNumber);
		setErr(false);
	}

	const onBetChange = (direction: -1 | 1) => {
		const nextBet = bets[betIndex + direction];
		nextBet && setSelectedBet(nextBet);
	}

	return (
		<div className='w-full h-full relative'>
			<Image src='/img/three-cards-monte/background-2.png' alt='background' fill={true}
			       className='object-contain'/>
			<div className='absolute inset-0 w-full h-full backdrop-blur'/>
			{
				loading || userLoading ?
					<div className='flex w-full h-full justify-center items-center'>
						<Loading/>
					</div>
					: (
						<div className='flex flex-col w-full h-3/4 justify-around'>
							<div className='grid grid-cols-3 w-1/2 h-full m-auto mt-4'>
								{
									([0, 1, 2] as const).map(id => (
										<div className='relative mx-4' key={`card-${id}`}>
											<Card
												id={id}
												isActive={activeCard === id}
												setActiveCard={setActiveCardHandler}
												front={[GameState.Started, GameState.Completed].includes(gameState)}
												isWinning={id === winningCard}
											/>
										</div>
									))
								}
							</div>
							<div className='z-10 h-1/4 flex items-center justify-center'>
								<span className='font-bold text-secondary-light text-xl drop-shadow-header'>Pick your card</span>
							</div>
							<div className='w-full h-1/4 z-10 flex flex-col justify-center items-center'>
								<button
									className='bg-primary-lighter hover:bg-primary-dark shadow-2xl text-secondary-dark duration-300 py-4 px-10 rounded-md font-bold'
									onClick={gameState === GameState.Completed ? reset : onSubmit}
									disabled={![GameState.Initiated, GameState.Completed].includes(gameState)}
								>
									{gameState === GameState.Completed ? 'Play again!' : 'Play!'}
								</button>
								<span className='text-sm mt-2 text-red-500'>{err ? 'Pick your card first' : ' '}</span>
							</div>
							<div className='absolute bottom-0 left-0 bg-primary-dark bg-opacity-50 w-full py-4 flex flex-col gap-2'>
								<div
									className='flex justify-center items-center text-secondary-light text-2xl border-b-1 border-b-secondary-light pb-2'>
									<div>
										Last win: {(win || 0).toLocaleString('pl-PL', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}
									</div>
								</div>
								<div
									className='flex flex-row w-full h-full text-secondary-light justify-around'>
									<div className='flex flex-row gap-2 items-center'>
										<RemoveIcon className='cursor-pointer' onClick={() => onBetChange(-1)}/>
										<span
											className='font-bold text-xl text-center w-16 pointer-events-none select-none'>{selectedBet.toLocaleString('pl-PL', {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										})}</span>
										<AddIcon className='cursor-pointer' onClick={() => onBetChange(1)}/>
									</div>
									<div className='font-bold text-xl pointer-events-none select-none'>
										Balance: {(user?.balance || 0).toLocaleString('pl-PL', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}
									</div>
								</div>
							</div>
						</div>
					)
			}
		</div>
	)
}