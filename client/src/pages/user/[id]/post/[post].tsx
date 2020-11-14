import React from 'react';
import { useRouter } from 'next/router';
import { isServer } from '../../../../util/isServer';
import { useFetchPostQuery } from '../../../../generated/graphql';
import {
	Box,
	Text,
	Flex,
	Button,
	Spinner,
	Stack,
	Textarea,
} from '@chakra-ui/core';
import styles from '../../../../styles/Home.module.css';
import Head from 'next/head';
import { Navbar } from '../../../../components/Navbar';
import { UserCard } from '../../../../components/UserCard';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { withApollo } from '../../../../util/withApollo';
import TextareaAutosize from 'react-textarea-autosize';

interface indexProps {
	post: any;
}

type BuildType = {
	type: string;
	value: string;
};

const Post: React.FC<indexProps> = () => {
	const router = useRouter();
	const { post } = router.query;
	const [buildState, setBuildState] = React.useState<BuildType[]>([]);

	const { data, loading } = useFetchPostQuery({
		skip: isServer(),
		variables: { id: post as string },
	});

	const handleChange = (index: number, value: string) => {
		const _build = [...buildState];
		_build[index]['value'] = value;

		setBuildState(_build);
	};

	const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) =>
		event.target.select();

	return loading ? (
		<div className={styles.container}>
			<Head>
				<title>FanStop - Loading</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Spinner />
		</div>
	) : data ? (
		<>
			<Head>
				<title>
					{data.post.poster.name} - {data.post.title}
				</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header>
				<Navbar />

				<UserCard
					name={data.post.poster.name}
					supporting={data.post.poster.supporting.length}
					supporters={data.post.poster.supporters}
					href={`/user/${data.post.poster._id}`}
				/>
				<Breadcrumbs
					crumbItems={[
						{
							text: data.post.poster.name,
							ref: `/user/${data.post.poster._id}`,
						},
						{
							text: data.post.title,
							ref: `/user/${data.post.poster._id}/post/${post}`,
						},
					]}
				/>
				<Button
					onClick={() => {
						setBuildState([
							...buildState,
							{ type: 'title', value: 'Sample Title' },
						]);
					}}
				>
					Title
				</Button>
				<Button
					onClick={() => {
						setBuildState([
							...buildState,
							{ type: 'text', value: 'Sample text' },
						]);
					}}
				>
					Text
				</Button>
			</header>
			<Flex flex={1} overflow="hidden">
				<Stack maxW={1200} background="#00ff00" m="auto" p={4} mt={9}>
					{buildState.map((x, i) =>
						x.type === 'title' ? (
							<input
								name="name"
								type="text"
								style={{
									textAlign: 'center',
									background: 'transparent',
									color: '#1A202C',
									opacity: '0.8',
									display: 'block',
									lineHeight: '1.5rem',
									fontSize: '2.25rem',
									fontWeight: 'bolder',
								}}
								onFocus={handleFocus}
								key={i}
								value={x.value}
								onChange={(e) =>
									handleChange(i, e.target.value)
								}
							/>
						) : (
							<Textarea
								name="name"
								style={{
									textAlign: 'left',
									background: 'transparent',
									color: '#1A202C',
									opacity: '0.8',
									display: 'block',
									lineHeight: '1.5rem',
									fontSize: '1rem',
								}}
								key={i}
								value={x.value}
								as={TextareaAutosize}
								onChange={(e) =>
									handleChange(i, e.target.value)
								}
							/>
						)
					)}

					<Text
						mb={6}
						color="gray.500"
						textAlign={['center', 'center', 'left', 'left']}
					>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu
						fugiat nulla pariatur. Excepteur sint occaecat cupidatat
						non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum. 5 PARAGRAPHS
					</Text>
				</Stack>
				<Box w="20%" h="100vh" background="blue.500">
					<Box p={4} m="auto">
						<Stack>
							{buildState.map((x) => (
								<p>{JSON.stringify(x)}</p>
							))}
						</Stack>
					</Box>
				</Box>
			</Flex>
		</>
	) : (
		<p>No post ☹️</p>
	);
};

export default withApollo(Post);
