'use client';

import {Plinko} from "@/games/plinko/Plinko";
import {useCallback, useState} from "react";

export default function PlinkoWrapper() {
	const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

	const handleRef = useCallback((element: HTMLDivElement) => {
		setContainerRef(element)
	}, [])

	return (
		<div ref={handleRef} className='w-full h-full'>
			<Plinko width={containerRef?.clientWidth || 0} height={containerRef?.clientHeight || 0}/>
		</div>
	)
}