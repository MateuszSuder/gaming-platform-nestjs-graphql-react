import React, {createContext, FunctionComponent, ReactNode, useContext, useState} from "react";
import {Modal} from "@/components/common/Modal";

interface IModalProviderProps {
	addModal?: (node: ReactNode) => void;
	close?: () => void;
}

const ModalContext = createContext<IModalProviderProps>({});

type Props = {
	children: ReactNode
}

export const ModalProvider: FunctionComponent<Props> = ({children}) => {
	const [modal, setModal] = useState<ReactNode>(null);

	const addModal = (node: ReactNode) => setModal(node);

	const close = () => setModal(null);

	const closeModal = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) close();
	}

	return (
		<ModalContext.Provider value={{addModal, close}}>
			{children}
			{
				modal && (
					<>
						<div className='modal-mask w-screen h-screen bg-primary-lighter bg-opacity-50 z-10 fixed'/>
						<div
							className='modal-container w-screen h-screen fixed flex justify-center items-center z-10'
							onClick={closeModal}>
							<Modal open={true}>{modal}</Modal>
						</div>
					</>
				)
			}
		</ModalContext.Provider>
	)
}

export default function useModal() {
	return useContext(ModalContext);
}