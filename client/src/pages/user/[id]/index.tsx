import { useRouter } from 'next/router';
import React from 'react';
import {
	useFetchUserQuery,
	useUserQuery,
	useSupporterMutation,
	FetchUserQuery,
	FetchUserDocument,
	UserQuery,
} from '../../../generated/graphql';
import styles from '../../../styles/Home.module.css';
import {
	Flex,
	Grid,
	Spinner,
	Stack,
	Tabs,
	Tab,
	TabList,
	Box,
	TabPanel,
	TabPanels,
} from '@chakra-ui/core';
import Head from 'next/head';
import { Navbar } from '../../../components/Navbar';
import { UserCard } from '../../../components/UserCard';
import { PostCard } from '../../../components/PostCard';
import { SupporterCard } from '../../../components/SupporterCard';
import { isServer } from '../../../util/isServer';
import { withApollo } from '../../../util/withApollo';

interface UserProfileProps {
	dataUser: UserQuery;
	id: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ dataUser, id }) => {
	return (
		<Flex flex={1} justify="center" overflow="hidden" p={4} mt={9}>
			<Tabs variant="enclosed" isFitted>
				<TabList mb="1rem">
					<Tab>Posts</Tab>
					<Tab>Supporting</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Stack spacing={8}></Stack>
					</TabPanel>
					<TabPanel>
						<Flex
							justifyContent="space-around"
							alignItems="center"
							flexDirection="row"
							flexWrap="wrap"
							w={900}
						>
							{dataUser.user.supporting.map((sup) => (
								<Box key={sup._id} shadow="lg">
									<SupporterCard
										name={sup.name}
										text="This is a test"
										href={`/user/${sup._id}`}
										key={sup._id}
									/>
								</Box>
							))}
						</Flex>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
};

const User = () => {
	const router = useRouter();
	const [handleSupporter] = useSupporterMutation();
	const { id } = router.query;
	const { data: dataUser, loading: loadingUser } = useUserQuery({
		skip: isServer(),
	});
	const [payload, setPayload] = React.useState<string>('Support');

	// Handles initial logic
	React.useEffect(() => {
		// check if the user is viewing their own profile and set payload accordingly
		if (dataUser) {
			if (dataUser.user && dataUser.user._id === id)
				setPayload('Edit Profile');
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

	const { data, loading } = useFetchUserQuery({
		skip: isServer(),
		variables: { id: id as string },
	});

	/*
	 * @desc: Updates the cache based on button press in the UserCard component
	 * @params:
	 * 	@param => _id: string
	 * 	@param => add: boolean
	 * @returns:
	 */
	const HandleSupportFetch = async (_id: string, add: boolean) => {
		await handleSupporter({
			variables: {
				id: _id,
				add: add,
			},
			update: (cache, { data }) => {
				cache.writeQuery<FetchUserQuery>({
					query: FetchUserDocument,
					data: {
						__typename: 'Query',
						fetchUser: data?.handleSupporter.user,
					},
				});
			},
		});
		payload === 'Supporting'
			? setPayload('Support')
			: setPayload('Supporting');
	};

	const HandleProfileFetch = () => {
		// router push
		router.push('/');
	};

	const HandlePayload = () => {
		switch (payload) {
			case 'Supporting':
				return (
					<Flex
						flex={1}
						justify="center"
						overflow="hidden"
						p={4}
						mt={9}
					>
						<Tabs variant="enclosed" isFitted w={632}>
							<TabList mb="1rem">
								<Tab>Posts</Tab>
								<Tab>Supporting</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<Stack spacing={8}>
										{data.fetchUser.posts.map((post) => (
											<>
												<PostCard
													key={post._id}
													title={post.title}
													author="Test"
													text={post.desc}
													href={`/user/${id}/post/${post._id.toString()}`}
												/>
											</>
										))}
									</Stack>
								</TabPanel>
								<TabPanel>
									<Flex
										justifyContent="center"
										alignItems="center"
										flexDirection="row"
										flexWrap="wrap"
									>
										{data.fetchUser.supporting.map(
											(sup) => (
												<>
													<SupporterCard
														key={sup._id}
														name={sup._id as string}
														text="This is a test"
														href={`/user/${sup._id}`}
													/>
												</>
											)
										)}
									</Flex>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Flex>
				);
			case 'Support':
				return (
					<Flex
						h="40vh"
						flex={1}
						align="center"
						justify="center"
						overflow="hidden"
					>
						<p>You must be supporting to view this content</p>
					</Flex>
				);
			default:
				return <UserProfile id={id as string} dataUser={dataUser} />;
		}
	};

	return loading || !id ? (
		<div className={styles.container}>
			<Head>
				<title>FanStop - Loading</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Spinner />
		</div>
	) : data.fetchUser ? (
		<div key={data.fetchUser._id}>
			<Head>
				<title>FanStop - {data.fetchUser.name}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header>
				<Navbar />

				{payload === 'Edit Profile' ? (
					<UserCard
						name={data.fetchUser.name}
						supporting={data.fetchUser.supporting.length}
						supporters={data.fetchUser.supporters.length}
						payload={payload}
						handleFetch={() => HandleProfileFetch()}
						href={`/user/${data.fetchUser._id}`}
					/>
				) : (
					<UserCard
						name={data.fetchUser.name}
						supporting={data.fetchUser.supporting.length}
						supporters={data.fetchUser.supporters.length}
						payload={payload}
						handleFetch={() =>
							HandleSupportFetch(
								data.fetchUser._id,
								payload === 'Support'
							)
						}
						href={`/user/${data.fetchUser._id}`}
					/>
				)}
			</header>

			<HandlePayload />
		</div>
	) : (
		<p>User not found</p>
	);
};

export default withApollo(User);
