import React from 'react';
import { useRouter } from 'next/router';
import { isServer } from '../../../../util/isServer';
import {
	useFetchPostQuery,
	useUserQuery,
	useSupporterMutation,
} from '../../../../generated/graphql';
import { Flex, Spinner, Stack } from '@chakra-ui/core';
import styles from '../../../../styles/Home.module.css';
import Head from 'next/head';
import { Navbar } from '../../../../components/Navbar';
import { UserCard } from '../../../../components/UserCard';
import { withApollo } from '../../../../util/withApollo';
import { PostView } from '../../../../components/posts/PostView';

interface indexProps {
	post: any;
}

const Post: React.FC<indexProps> = () => {
	const router = useRouter();
	const { id, post } = router.query;

	const [payload, setPayload] = React.useState('');
	const { data, loading } = useFetchPostQuery({
		variables: { id: post as string },
		skip: isServer(),
	});

	const { data: dataUser, loading: loadingUser } = useUserQuery({
		skip: isServer(),
	});

	// Handles initial logic
	React.useEffect(() => {
		// check if the user is viewing their own profile and set payload accordingly
		if (dataUser) {
			if (dataUser.user && dataUser.user._id === id)
				setPayload('Supporting');
			else if (!dataUser.user) setPayload('Not signed in');
			else {
				const result = dataUser.user.supporting.some(
					(x) => x['_id'] === id
				);
				if (result)
					// if the user is in the array then we add them
					setPayload('Supporting');
			}
		}
	}, [loadingUser, id]);

	const HandlePayload = () => {
		switch (payload) {
			case 'Not signed in': {
				return null; // TODO: reroute user back to where they were on sign in
			}

			case 'Supporting': {
				return loading || !post ? (
					<div className={styles.container}>
						<Head>
							<title>FanStop - Loading...</title>
						</Head>
						<Spinner />
					</div>
				) : (
					<>
						<Navbar />
						<UserCard
							name={data.post.poster.name}
							supporting={data.post.poster.supporting.length}
							supporters={data.post.poster.supporters}
							href={`/user/${data.post.poster._id}`}
						/>
						<Flex flex={1} overflow="hidden">
							<PostView buildState={data.post.buildMap} />
						</Flex>
					</>
				);
			}

			default: {
				return null;
			}
		}
	};

	return <HandlePayload />;
};

export default withApollo(Post);
