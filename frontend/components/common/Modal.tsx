import {FunctionComponent, ReactNode, useState} from "react";

type Props = {
	open: boolean;
	children?: ReactNode;
};
export const Modal: FunctionComponent<Props> = ({open, children}) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(open);

	if (open !== isModalOpen) setIsModalOpen(open)

	if (!open) return <></>

	return (
		<div
			className='modal-content bg-primary-lighter border-1 border-secondary-light rounded-md drop-shadow-header-dark p-4'>
			{children}
		</div>
	);
};