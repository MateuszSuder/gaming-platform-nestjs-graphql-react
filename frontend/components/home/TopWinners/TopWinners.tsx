"use client";

import SectionHeader from "@/components/common/SectionHeader";

type Props = {};

interface HighestWin {
	username: string;
	game: string;
	win: number
}

interface HighestXWin {
	username: string;
	game: string;
	multiplier: number
}

const highestWins: HighestWin[] = [
	{
		username: 'user643',
		game: 'Plinko',
		win: 15000
	},
	{
		username: 'user321',
		game: 'Slot machine',
		win: 14225
	},
	{
		username: 'user7653',
		game: 'Plinko',
		win: 13000
	},
	{
		username: 'user3215',
		game: 'Slot machine',
		win: 15632
	},
	{
		username: 'user23123',
		game: 'Slot machine',
		win: 15632
	}
]

const highestXWins: HighestXWin[] = [
	{
		username: 'user643',
		game: 'Slot machine',
		multiplier: 3500
	},
	{
		username: 'user321',
		game: 'Slot machine',
		multiplier: 2573
	},
	{
		username: 'user7653',
		game: 'Plinko',
		multiplier: 1000
	},
	{
		username: 'user3215',
		game: 'Slot machine',
		multiplier: 933
	},
	{
		username: 'user23123',
		game: 'Plinko',
		multiplier: 925
	}
]

export default function TopWinners(props: Props) {
	return (
		<div className='grid grid-cols-3 gap-5 my-10'>
			<div className='bg-gradient-to-b from-primary-lighter from-10% to-transparent to-75% rounded'>
				<SectionHeader text='Highest wins'/>
				<div className='m-2'>
					{
						highestWins.map(({win, game, username}, index) => (
							<div key={`highest-win-${username}-${index}`}
							     className={`grid grid-cols-3 justify-center items-center px-2 rounded h-8 ${(index % 2) && 'bg-primary-dark'}`}>
								<div className='font-bold drop-shadow-text-white-shadow'>{username}</div>
								<div className='font-bold drop-shadow-text-white-shadow'>{game}</div>
								<div className='text-right drop-shadow-text-white-shadow'>{win.toLocaleString('pl-PL', {
									maximumFractionDigits: 2,
									minimumFractionDigits: 2
								})}</div>
							</div>
						))
					}
				</div>
			</div>
			<div className='bg-gradient-to-b from-primary-lighter from-10% to-transparent to-75% rounded'>
				<SectionHeader text='Highest multiplier wins'/>
				<div className='m-2'>
					{
						highestXWins.map(({multiplier, game, username}, index) => (
							<div key={`highest-win-${username}-${index}`}
							     className={`grid grid-cols-3 justify-center items-center px-2 rounded h-8 ${(index % 2) && 'bg-primary-dark'}`}>
								<div className='font-bold drop-shadow-text-white-shadow'>{username}</div>
								<div className='font-bold drop-shadow-text-white-shadow'>{game}</div>
								<div className='text-right drop-shadow-text-white-shadow'>{multiplier.toLocaleString('pl-PL')}x</div>
							</div>
						))
					}
				</div>
			</div>
		</div>
	);
};