import Image from "next/image";
import {useRouter} from "next/navigation";

type Props = {
	src: string;
	name: string;
	path: string;
};

export default function GameCard({src, name, path}: Props) {
	const {push} = useRouter();

	return (
		<div
			className='relative border-8 border-primary-lighter bg-primary-dark h-64 aspect-square rounded bg-opacity-50 drop-shadow-2xl hover:-translate-y-1.5 duration-300 cursor-pointer select-none m-auto'
			onClick={() => push(path)}
		>
			<div className='hover:bg-primary-lighter'>
				<Image src={src} alt={name} fill={true}/>
				<div className='absolute w-full h-full bg-game-gradient to-transparent inset-0 z-10'/>
				<div className='absolute w-full h-full bg-game-gradient to-transparent opacity-40 inset-0'/>
				<div
					className='absolute flex items-center justify-between flex-col w-full h-full inset-0 bg-primary-lighter bg-opacity-0 opacity-0 z-10 hover:bg-opacity-80 hover:opacity-100 duration-300 p-4'>
					<div
						className='text-secondary-light text-xl text-opacity-70 antialiased font-bold opacity-100 w-80% drop-shadow-header'>
						{name}
					</div>
					<div className='text-2xl text-secondary-dark font-extrabold text-opacity-70 drop-shadow-header-dark'>
						Play
					</div>
				</div>
			</div>
		</div>
	);
};