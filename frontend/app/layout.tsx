"use client";

import './globals.css'
import {ReactNode} from "react";
import Header from "@/components/global/Header/Header";

export default function RootLayout({
	                                   children,
                                   }: {
	children: ReactNode
}) {
	return (
		<html lang="en">
		<body className='bg-[url(/img/background_2x_exported.webp)] bg-no-repeat bg-cover overflow-x-hidden flex flex-col'>
		<div className='max-w-7xl w-full m-auto relative'>
			<Header/>
			<div>{children}</div>
		</div>
		<div className='h-screen w-screen fixed bottom-0 bg-background-gradient -z-10'/>
		</body>
		</html>
	)
}
