import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const apolloClient = (initialState) => {
	return new ApolloClient({
		credentials: 'include',

		link: createHttpLink({
			uri: 'http://localhost:4000/graphql',
			credentials: 'include',
		}),
		cache: new InMemoryCache().restore(initialState || {}),
	});
};

export default apolloClient;
