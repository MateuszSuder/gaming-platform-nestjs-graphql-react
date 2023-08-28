'use client';

import {FunctionComponent, memo} from "react";
import {Sprite, Stage} from "@pixi/react";
import {BottomBar} from "@/games/777-fruits/BottomBar/BottomBar";
import {Symbols} from "@/games/777-fruits/Symbols/Symbols";
import useSevenFruits from "@/context/sevenFruitsContext";

export const bottomBarHeight = 120;

type Props = {
	width: number;
	height: number;
};

export const SevenFruits: FunctionComponent<Props> = memo(({width, height}) => {
	const {symbols, nextSymbols, gameState, complete} = useSevenFruits();

	if (height === 0 || width === 0) return (<></>);

	return (
		<div className='relative w-full h-full'>
			{gameState}
			<Stage {...{width, height: height - bottomBarHeight}} options={{backgroundAlpha: 0}}>
				<Symbols
					width={width}
					height={height - bottomBarHeight}
					symbols={symbols}
					nextSymbols={nextSymbols}
					onComplete={complete}
					gameState={gameState}
				/>
				<Sprite image={'/img/777fruits/background.png'} {...{width, height: height - bottomBarHeight}} />
			</Stage>
			<BottomBar/>
		</div>
	);
});

SevenFruits.displayName = 'SevenFruits';