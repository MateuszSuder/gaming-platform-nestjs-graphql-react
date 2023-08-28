'use client'

import {Fragment, FunctionComponent, useMemo, useReducer, useRef} from "react";
import {Container, Sprite, useTick} from "@pixi/react";
import {GameState} from "@/types/socketio";

const basePath = '/img/777fruits/';

const reducer = (_: any, {data}: { type: string, data: { y: number } }) => {
	return data;
};

type Props = {
	width: number;
	height: number;
	symbols: string[][];
	nextSymbols: string[][];
	gameState: GameState;
	onComplete?: () => void;
};
export const Symbols: FunctionComponent<Props> = ({width, height, symbols, nextSymbols, onComplete, gameState}) => {
	const [motion, update] = useReducer(reducer, {y: 0});
	const iter = useRef(0);
	const isCompleted = useRef(false);

	useTick((delta) => {
		if (gameState === GameState.Completed && iter.current !== 0) {
			iter.current = 0;
			update({
				type: 'update',
				data: {
					y: 0
				}
			})
			isCompleted.current = false;
		}
		if (gameState !== GameState.Started) return;

		if (motion.y < height) {
			const y = (iter.current += 10 * delta);

			update({
				type: 'update',
				data: {
					y
				}
			})
		} else if (!isCompleted.current) {
			isCompleted.current = true;
			onComplete && onComplete();
		}
	})


	const reelBoundaries = useMemo(() => {
		const reelWidth = width / 3;
		const symbolHeight = height / 3;

		return {
			x: [0, reelWidth, reelWidth, reelWidth * 2, reelWidth * 2, width],
			y: [0, symbolHeight, symbolHeight, symbolHeight * 2, symbolHeight * 2, height]
		}
	}, [width, height]);

	return (
		<Container y={motion.y}>
			{
				nextSymbols.map((row, i) => {
					const y = -height + (reelBoundaries.y[i * 2] + reelBoundaries.y[i * 2 + 1]) / 2;

					return (
						<Fragment key={`next-${i}${Math.random()}`}>
							{
								row.map((symbol, j) => {
									const x = (reelBoundaries.x[j * 2] + reelBoundaries.x[j * 2 + 1]) / 2;

									return (
										<Sprite
											key={`${i}${j}${Math.random()}`}
											position={{x, y}}
											anchor={{x: 0.5, y: 0.5}}
											scale={{x: 0.9, y: 0.9}}
											image={`${basePath}${symbol}`}
										/>
									)
								})
							}
						</Fragment>
					)
				})
			}
			{
				symbols.map((row, i) => {
					const y = (reelBoundaries.y[i * 2] + reelBoundaries.y[i * 2 + 1]) / 2;

					return (
						<Fragment key={`${i}${Math.random()}`}>
							{
								row.map((symbol, j) => {
									const x = (reelBoundaries.x[j * 2] + reelBoundaries.x[j * 2 + 1]) / 2;

									return (
										<Sprite
											key={`${i}${j}${Math.random()}`}
											position={{x, y}}
											anchor={{x: 0.5, y: 0.5}}
											scale={{x: 0.9, y: 0.9}}
											image={`${basePath}${symbol}`}
										/>
									)
								})
							}
						</Fragment>
					)
				})
			}
		</Container>
	);
};