import {FunctionComponent, useCallback, useReducer, useRef} from "react";
import {Graphics as IGraphics, IPointData} from "pixi.js";
import {Graphics, useTick} from "@pixi/react";
import {PlinkoDirection} from "@/types/socketio";
import {bumperSize, spacingX} from "@/games/plinko/Plinko";

const reducer = (_: any, {data}: { type: string, data: { x: number, y: number } }) => {
	return data;
};

const acceleration = 1.2;

type Props = {
	width: number;
	height: number;
	size: number;
	containersBounds: number[];
	pattern: PlinkoDirection[];
	complete: () => void;
};
export const Ball: FunctionComponent<Props> = ({width, height, size, containersBounds, pattern, complete}) => {
	const [motion, update] = useReducer(reducer, {x: 0, y: 0});
	const x = useRef<number>(0);
	const y = useRef<number>(0);
	const nextBumperDirection = useRef<PlinkoDirection | null>(null);
	const nextDestination = useRef<IPointData>({
		x: 0,
		y: containersBounds[0]
	});
	const containerIndex = useRef<number>(0);
	const isCompleted = useRef(false);

	const bumperCollisionSize = bumperSize * 0.22;

	const draw = useCallback((g: IGraphics) => {
		g.lineStyle(0);
		g.beginFill('red', 1);
		g.drawCircle(width / 2, 0, size);
		g.endFill();
	}, [size, width]);

	useTick((delta) => {
		if (nextBumperDirection.current === undefined) {
			!isCompleted.current && complete();
			isCompleted.current = true;
			return;
		}


		if (y.current + size - bumperCollisionSize >= nextDestination.current.y || y.current - size * 2 - bumperSize > containersBounds[containersBounds.length - 1]) {
			const nextIndex = containerIndex.current + 1;

			if (!nextIndex) return;

			containerIndex.current = nextIndex;
			nextBumperDirection.current = pattern[nextIndex - 1];
			nextDestination.current = {
				y: containersBounds[nextIndex],
				x: pattern[nextIndex - 1] === PlinkoDirection.Left ? x.current - spacingX / 2 : x.current + spacingX / 2
			}

			return;
		}

		if (containersBounds.length) {
			switch (nextBumperDirection.current) {
				case PlinkoDirection.Left:
					update({
						type: 'update',
						data: {
							x: (x.current + size <= nextDestination.current.x) ? x.current : (x.current -= acceleration),
							y: (y.current >= nextDestination.current.y) ? y.current : (y.current += acceleration)
						}
					})
					break;
				case PlinkoDirection.Right:
					update({
						type: 'update',
						data: {
							x: (x.current - size >= nextDestination.current.x) ? x.current : (x.current += acceleration),
							y: (y.current >= nextDestination.current.y) ? y.current : (y.current += acceleration)
						}
					})
					break;
				default:
					update({
						type: 'update',
						data: {
							x: 0,
							y: (y.current += acceleration)
						}
					})
					break;
			}
		}
	})

	return (
		<>
			<Graphics draw={draw} {...motion} />
		</>
	);
};