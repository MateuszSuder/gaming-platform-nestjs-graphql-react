import {HttpLink} from "@apollo/client";
import {NextSSRApolloClient, NextSSRInMemoryCache,} from "@apollo/experimental-nextjs-app-support/ssr";
import {registerApolloClient} from "@apollo/experimental-nextjs-app-support/rsc";


export const {getClient} = registerApolloClient(() => {
	return new NextSSRApolloClient({
		cache: new NextSSRInMemoryCache(),
		link: new HttpLink({
			uri: "http://localhost:8080/graphql",
			credentials: 'omit',
			fetchOptions: {
				mode: 'no-cors'
			}
		}),
	});
});