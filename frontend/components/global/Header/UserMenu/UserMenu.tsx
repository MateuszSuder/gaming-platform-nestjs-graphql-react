import {FunctionComponent} from "react";

type Props = {};
export const UserMenu: FunctionComponent<Props> = ({}) => {
	return (
		<div className='absolute bottom-0 right-0 translate-y-full rounded drop-shadow-2xl min-w-[10rem]'>
			<div className='relative grid flex-col p-4 mt-1 gap-2 text-right'>
				<div
					className='absolute inset-0 w-full bg-gradient-to-r from-primary-dark via-primary-lighter to-primary-dark opacity-50 rounded -z-10'/>
				<div
					className='font-bold text-secondary-light border-solid border-b border-b-secondary-light cursor-pointer'>
					<div className='w-full hover:drop-shadow-header'>
						Game history
					</div>
				</div>
				<div className='font-bold text-secondary-light border-solid border-b-1 border-b-secondary-light cursor-pointer'>
					<div className='w-full hover:drop-shadow-header duration-300'>
						Logout
					</div>
				</div>
			</div>
		</div>
	);
};