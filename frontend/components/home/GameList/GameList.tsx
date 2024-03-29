"use client";

import React, {Fragment, useMemo} from 'react';
import GameCard from "@/components/home/GameCard/GameCard";
import useGameList from "@/context/gameListContext";
import {Loading} from "@/components/common/Loading";

const gamesMap = {
	1: {
		src: '/img/three-card-monte.png',
		path: '/game/three-card-monte'
	},
	2: {
		src: '/img/seven-fruits.png',
		path: '/game/777-fruits'
	},
	3: {
		src: '/img/plinko.png',
		path: '/game/plinko'
	}
}

const GameList = () => {
	const {games, gamesLoading, chosenCategory} = useGameList();

	const filteredGames = useMemo(() => {
		if (chosenCategory === 'All') return games;

		return games.filter(game => game.category === chosenCategory);
	}, [chosenCategory, games])

	if (gamesLoading) return (
		<div className='w-100 justify-center items-center mt-4'>
			<Loading/>
		</div>
	)

	if (!games.length) return (<div className='grid grid-cols-2 justify-center gap-10'>No games found</div>);

	return (
		<div className='grid grid-cols-3 justify-center gap-10'>
			{
				filteredGames.map((game) => (
					<Fragment key={`game-${game.id}`}>
						{
							game.id in gamesMap && (
								<GameCard
									src={gamesMap[game.id as keyof typeof gamesMap].src}
									name={game.name}
									path={gamesMap[game.id as keyof typeof gamesMap].path}
								/>
							)
						}
					</Fragment>
				))
			}
		</div>
	);
};

export default GameList;