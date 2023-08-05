"use client";

import './globals.css'
import {ReactNode} from "react";
import Header from "@/components/global/Header/Header";
import {ApolloWrapperClient} from "@/lib/apollo-wrapper";
import {loadDevMessages, loadErrorMessages} from "@apollo/client/dev";
import {__DEV__} from "@apollo/client/utilities/globals";
import {GameListProvider} from "@/context/gameListContext";

export default function RootLayout({
	                                   children,
                                   }: {
	children: ReactNode
}) {
	if (__DEV__) {  // Adds messages only in a dev environment
		loadDevMessages();
		loadErrorMessages();
	}

	return (
		<html lang="en">
		<body className='bg-[url(/img/background_2x_exported.webp)] bg-no-repeat bg-cover overflow-x-hidden flex flex-col'>
		<ApolloWrapperClient>
			<div className='max-w-7xl w-full m-auto relative'>
				<Header/>
				<GameListProvider>
					<div>{children}</div>
				</GameListProvider>
			</div>
			<div className='h-screen w-screen fixed bottom-0 bg-background-gradient -z-10'/>
		</ApolloWrapperClient>
		</body>
		</html>
	)
}
