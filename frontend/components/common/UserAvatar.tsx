import {FunctionComponent} from "react";

type Props = {
	username: string;
	onClick?: () => any;
};
export const UserAvatar: FunctionComponent<Props> = ({username, onClick}) => {
	const usernameFirstLetter = username.at(0)?.toUpperCase();

	return (
		<div
			className='rounded-full bg-primary-dark h-4/5 aspect-square
			flex justify-center items-center
			drop-shadow-header-dark border-secondary-light border-1 cursor-pointer
			text-xl
			hover:h-22/25 duration-300'
			onClick={onClick}
		>
			<div className='text-secondary-light font-bold'>
				{usernameFirstLetter}
			</div>
		</div>
	);
};