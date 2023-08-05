"use client";

import {ApolloLink, HttpLink,} from "@apollo/client";
import {
	ApolloNextAppProvider,
	NextSSRApolloClient,
	NextSSRInMemoryCache,
	SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support/ssr";
import {PropsWithChildren} from "react";

function makeClient() {
	const httpLink = new HttpLink({
		uri: "http://localhost:8080/graphql",
	});

	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache(),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
					new SSRMultipartLink({
						stripDefer: true,
					}),
					httpLink,
				])
				: httpLink,
	});
}

export function ApolloWrapperClient({children}: PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}