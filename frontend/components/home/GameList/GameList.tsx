"use client";

import React from 'react';
import GameCard from "@/components/home/GameCard/GameCard";
import useGameList from "@/context/gameListContext";
import {Loading} from "@/components/common/Loading";

const gamesMap = {
	1: {
		src: '/img/three-card-monte.png'
	}
}

const GameList = () => {
	const {games, gamesLoading} = useGameList();

	if (gamesLoading) return (
		<div className='w-100 justify-center items-center mt-4'>
			<Loading/>
		</div>
	)

	if (!games?.length) return (<div className='grid grid-cols-2 justify-center gap-10'>No games found</div>);

	return (
		<div className='grid grid-cols-2 justify-center gap-10'>
			{
				games.map((game) => (
					<>
						{
							game.id in gamesMap && (
								<GameCard src={gamesMap[game.id as keyof typeof gamesMap].src} name={game.name}/>
							)
						}
					</>
				))
			}
		</div>
	);
};

export default GameList;