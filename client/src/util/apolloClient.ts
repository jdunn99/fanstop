import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
	uri: 'http://localhost:4000/graphql',
	credentials: 'include',
});

const wsLink = process.browser
	? new WebSocketLink({
			// if you instantiate in the server, the error will be thrown
			uri: `ws://localhost:4000/graphql`,

			options: {
				reconnect: true,
			},
	  })
	: null;

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link = process.browser
	? split(
			//only create the split in the browser
			// split based on operation type
			({ query }) => {
				const def = getMainDefinition(query);
				return (
					def.kind === 'OperationDefinition' &&
					def.operation === 'subscription'
				);
			},
			wsLink,
			httpLink
	  )
	: httpLink;
const apolloClient = (initialState) => {
	return new ApolloClient({
		link: link,
		cache: new InMemoryCache().restore(initialState || {}),
	});
};

export default apolloClient;
