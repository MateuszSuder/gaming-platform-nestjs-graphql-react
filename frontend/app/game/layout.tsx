'use client';

import {ReactNode} from "react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {usePathname, useRouter} from "next/navigation";
import useAuth from "@/context/authContext";
import {plinkoSocket, sevenFruitsSocket, threeCardsMonteSocket} from "@/components/socketio/socket";

const nameMapper = {
	'777-fruits': '777 Fruits',
	'three-card-monte': 'Three-card monte',
	'plinko': 'Plinko'
}

export default function GamaLayout({
	                                   children,
                                   }: {
	children: ReactNode
}) {
	const router = useRouter();
	const pathname = usePathname();
	const {loading, user} = useAuth();

	if (!loading && !user) router.push('/');

	const gamePath = pathname.replace('/game/', '') as keyof typeof nameMapper;

	const onBack = () => {
		sevenFruitsSocket.disconnect();
		threeCardsMonteSocket.disconnect();
		plinkoSocket.disconnect();
		router.push('/');
	}

	return (
		<div className='w-100 aspect-video flex flex-col gap-2'>
			<div className='bg-primary-lighter bg-opacity-80 rounded shadow-xl flex flex-row justify-between py-2 px-4'>
				<div className='text-secondary-light drop-shadow-header-dark font-bold'>{nameMapper[gamePath]}</div>
				<div
					onClick={onBack}
					className='text-secondary-light flex flex-row items-center gap-1 cursor-pointer hover:bg-opacity-50 drop-shadow-header-dark font-bold hover:drop-shadow-header duration-300'>
					<KeyboardBackspaceIcon/>
					Back
				</div>
			</div>
			<div className='bg-primary-lighter bg-opacity-80 rounded shadow-xl py-2 px-2 aspect-video'>
				{children}
			</div>
		</div>
	)
}