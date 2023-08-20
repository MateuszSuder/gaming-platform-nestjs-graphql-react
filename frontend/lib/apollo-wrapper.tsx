"use client";

import {ApolloLink, HttpLink, split,} from "@apollo/client";
import {
	ApolloNextAppProvider,
	NextSSRApolloClient,
	NextSSRInMemoryCache,
	SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support/ssr";
import {PropsWithChildren} from "react";
import {getMainDefinition} from "@apollo/client/utilities";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";

function makeClient() {
	const httpLink = new HttpLink({
		uri: "http://localhost:8080/graphql",
	});

	const wsLink = new GraphQLWsLink(createClient({
		url: "ws://localhost:8080/graphql"
	}));

	const splitLink = split(
		({query}) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			);
		},
		wsLink,
		httpLink,
	);

	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache(),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
					new SSRMultipartLink({
						stripDefer: true,
					}),
					splitLink,
				])
				: splitLink,
	});
}

export function ApolloWrapperClient({children}: PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}