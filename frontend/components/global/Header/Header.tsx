import Login from "@/components/home/Login/Login";
import {useEffect, useRef, useState} from "react";

type Props = {};

export default function Header(props: Props) {
	const [loginOpen, setLoginOpen] = useState(false);
	const [scrollThresholdMet, setScrollThresholdMet] = useState(false);

	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (ref.current?.offsetTop && (ref.current?.offsetTop > 20)) {
				setScrollThresholdMet(true);
			} else {
				setScrollThresholdMet(false);
			}
			// }
		})
	}, [ref])

	return (
		<>
			<nav className='sticky top-0 mt-5 w-full h-20 grid items-center p-2 drop-shadow-2xl mb-5 z-10' ref={ref}>
				<div
					className={`absolute inset-0 w-full shadow-2xl bg-gradient-to-r from-primary-dark via-primary-lighter to-primary-dark rounded ${scrollThresholdMet ? 'opacity-100' : 'opacity-50'}`}
				/>
				<div className='relative max-w-[8%] w-full h-full justify-self-end'>
					<button
						className='bg-primary-dark text-secondary-light h-full p-1 bg-opacity-20 rounded w-full hover:bg-opacity-50 duration-500'
						onClick={() => setLoginOpen(prevState => !prevState)}>
						<span className='drop-shadow-header'>Login</span>
					</button>
				</div>
				{loginOpen && <Login/>}
			</nav>
		</>
	);
};