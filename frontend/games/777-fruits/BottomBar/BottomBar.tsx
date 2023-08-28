import {FunctionComponent} from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import useAuth from "@/context/authContext";
import useSevenFruits from "@/context/sevenFruitsContext";

type Props = {};
export const BottomBar: FunctionComponent<Props> = () => {
	const {user} = useAuth();
	const {bets, selectedBet, setSelectedBet, win, gameState, start} = useSevenFruits()

	const betIndex = bets.indexOf(selectedBet);

	const onBetChange = (direction: -1 | 1) => {
		const nextBet = bets[betIndex + direction];
		nextBet && setSelectedBet && setSelectedBet(nextBet);
	}

	const onSpin = () => {
		start && start();
	}

	return (
		<div
			className={`absolute bottom-0 border-secondary-light border-1 w-full h-[120px] bg-primary-dark bg-opacity-50 flex flex-col`}
		>
			<div
				className='flex justify-center items-center text-secondary-light text-2xl border-b-1 border-b-secondary-light pb-2'>
				<div>
					Last win: {(win || 0).toLocaleString('pl-PL', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
				</div>
			</div>
			<div className='grid grid-cols-3 justify-items-center w-full h-full text-secondary-light'>
				<div className='flex flex-row gap-2 items-center'>
					<RemoveIcon className='cursor-pointer' onClick={() => onBetChange(-1)}/>
					<span
						className='font-bold text-xl text-center w-16 pointer-events-none select-none'>{selectedBet.toLocaleString('pl-PL', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}</span>
					<AddIcon className='cursor-pointer' onClick={() => onBetChange(1)}/>
				</div>
				<div className='font-bold text-xl pointer-events-none select-none flex items-center'>
					Balance: {(user?.balance || 0).toLocaleString('pl-PL', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
				</div>
				<div className='flex items-center'>
					<div
						className='border-1 border-secondary-light drop-shadow-header px-5 py-2 font-bold rounded-sm cursor-pointer hover:scale-105 duration-300'
						onClick={onSpin}
					>
						SPIN
					</div>
				</div>
			</div>
		</div>
	);
};