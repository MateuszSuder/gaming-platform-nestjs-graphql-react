"use client";

import SectionHeader from "@/components/common/SectionHeader";
import {useTopWinsQuery} from "@/types/gql/graphql";
import {Loading} from "@/components/common/Loading";

type Props = {};

export default function TopWinners(props: Props) {
	const {data, loading} = useTopWinsQuery();

	const highestWins = (data?.topWins.topWins || []).sort((a, b) => b.win - a.win);
	const highestXWins = (data?.topWins.topMultipliers || []).sort((a, b) => b.multiplier - a.multiplier);

	return (
		<div className='grid grid-cols-2 gap-5 my-10'>
			<div className='bg-gradient-to-b from-primary-lighter from-10% to-transparent to-75% rounded'>
				<SectionHeader text='Highest wins'/>
				{
					loading
						? (<Loading/>)
						: <div className='m-2'>
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
				}
			</div>
			<div className='bg-gradient-to-b from-primary-lighter from-10% to-transparent to-75% rounded'>
				<SectionHeader text='Highest multiplier wins'/>
				{
					loading
						? (<Loading/>)
						: <div className='m-2'>
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
				}
			</div>
		</div>
	);
};