"use client";

type Props = {
	text: string;
};

export default function SectionHeader({text}: Props) {
	return (
		<div>
			<div
				className='font-bold text-secondary-light text-xl opacity-80 border-b border-solid border-b-secondary-light m-2 mb-0 pb-1 drop-shadow-header'>
				{text}
			</div>
		</div>
	);
};