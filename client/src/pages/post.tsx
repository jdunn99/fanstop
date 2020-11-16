import React from 'react';
import { useRouter } from 'next/router';
import { isServer } from '../util/isServer';
import { useUserQuery, BuildMap } from '../generated/graphql';
import { Box, Flex, Button, Spinner, Stack } from '@chakra-ui/core';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import { Navbar } from '../components/Navbar';
import { withApollo } from '../util/withApollo';
import { PostView } from '../components/posts/PostView';
import { PostEdit } from '../components/posts/PostEdit';
import { BuildType } from '../util/types';
import { SubmitPost } from '../components/posts/SubmitPost';
import { EditNav } from '../components/posts/EditNav';

interface indexProps {
	post: any;
}

const Post: React.FC<indexProps> = () => {
	const router = useRouter();

	const [buildState, setBuildState] = React.useState<BuildMap[]>([]);
	const [preview, setPreview] = React.useState<boolean>(false);
	const [index, setIndex] = React.useState<number>(0);

	const { data, loading } = useUserQuery();

	React.useEffect(() => {
		if (!loading && !data.user) router.push('/login');
	}, [loading]);

	const handleChange = (index: number, value: string) => {
		const _build = [...buildState];
		_build[index]['value'] = value;

		setBuildState(_build);
	};

	const handleFocus = (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.FocusEvent<HTMLTextAreaElement>
	) => event.target.select();

	const handleDelete = (index: number) => {
		const _build = [...buildState];

		if (index === 0) _build.shift();
		else _build.splice(index, 1);

		setBuildState(_build);
	};

	const handleInsert = (index: number, item: BuildType) => {
		const _build = [...buildState];

		if (buildState.length === 0) _build.push(item);
		else _build.splice(index + 1, 0, item);

		setBuildState(_build);
	};

	return loading ? (
		<div className={styles.container}>
			<Head>
				<title>FanStop - Loading...</title>
			</Head>
			<Spinner />
		</div>
	) : (
		<>
			<Head>
				<title>FanStop - Create Post</title>
			</Head>
			<Navbar />

			<Flex flex={1} overflow="hidden">
				{preview ? (
					<PostView buildState={buildState} />
				) : (
					<PostEdit
						buildState={buildState}
						handleChange={handleChange}
						handleDelete={handleDelete}
						handleFocus={handleFocus}
						handleInsert={handleInsert}
						index={index}
						setIndex={(q) => setIndex(q)}
					/>
				)}

				<Box w="20%" minH="100vh" background="blue.300">
					<Box flex={1} p={4} m="auto">
						<Stack textAlign="center">
							<Button mt={8} onClick={() => setPreview(!preview)}>
								{preview ? 'Edit' : 'Preview'}
							</Button>
							{preview ? (
								<SubmitPost buildMap={buildState} />
							) : (
								<EditNav
									buildState={buildState}
									handleChange={handleChange}
									handleDelete={handleDelete}
									handleFocus={handleFocus}
									handleInsert={handleInsert}
									index={index}
									setIndex={(q) => setIndex(q)}
								/>
							)}
						</Stack>
					</Box>
				</Box>
			</Flex>
		</>
	);
};

export default withApollo(Post);
