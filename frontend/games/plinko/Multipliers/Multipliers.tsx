'use client';

import {FunctionComponent, useMemo} from "react";
import {Text} from "@pixi/react";
import {TextStyle} from "pixi.js";
import {bumperSize, spacingX} from "@/games/plinko/Plinko";

type Props = {
	height: number;
	width: number;
	multipliers: number[];
};
export const Multipliers: FunctionComponent<Props> = ({width, height, multipliers}) => {

	const adjustedMultipliers = useMemo(() => {
		return [
			...multipliers,
			...multipliers.reverse().slice(1)
		]
	}, [multipliers])

	return (
		<>
			{
				adjustedMultipliers.map((multi, i) => (
					<Text
						key={`multiplier-${i}-${multi}`}
						text={`${multi}x`}
						anchor={{y: 1, x: 0.5}}
						x={width / 2 - (bumperSize + spacingX) * (Math.floor(adjustedMultipliers.length / 2) - i)}
						y={height}
						style={
							new TextStyle({
								align: 'center',
								fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
								fontSize: 40,
								fontWeight: '400',
								fill: ['#e0d287'],
								dropShadow: true,
								dropShadowColor: '#9c8a28',
								dropShadowAngle: Math.PI / 6,
								dropShadowBlur: 4,
								dropShadowDistance: 3,
							})
						}
					/>
				))
			}
		</>
	);
};