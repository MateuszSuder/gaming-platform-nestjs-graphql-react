'use client'

import {useCallback, useState} from "react";
import {SevenFruits} from "@/games/777-fruits/SevenFruits"
import {SevenFruitsProvider} from "@/context/sevenFruitsContext";

export default function SevenFruitsWrapper() {
	const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

	const handleRef = useCallback((element: HTMLDivElement) => {
		setContainerRef(element)
	}, [])

	return (
		<div ref={handleRef} className='w-full h-full'>
			<SevenFruitsProvider>
				<SevenFruits
					width={containerRef?.clientWidth || 0}
					height={containerRef?.clientHeight || 0}
				/>
			</SevenFruitsProvider>
		</div>
	)
}