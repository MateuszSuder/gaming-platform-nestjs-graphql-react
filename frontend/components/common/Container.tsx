import SectionHeader from "@/components/common/SectionHeader";
import {ReactNode} from "react";

type Props = {
	title?: string;
	children: ReactNode;
};

export default function Container({title, children}: Props) {
	return (
		<div className='rounded drop-shadow-2xl'>
			{title && <SectionHeader text={title}/>}
			<div className='bg-primary-lighter rounded'>
				{children}
			</div>
		</div>
	);
};