import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Box, Button, Heading, Flex, Spinner } from '@chakra-ui/core';
import { Field } from '../components/Field';
import { Formik, Form } from 'formik';
import { withApollo } from '../util/withApollo';
import {
	UserQuery,
	UserDocument,
	useLoginMutation,
	useUserQuery,
	useLogoutMutation,
} from '../generated/graphql';
import { useApolloClient } from '@apollo/client';
import Link from 'next/link';

const isServer = () => typeof window === 'undefined';

function Login() {
	const { data, loading } = useUserQuery({ skip: isServer() });
	const [login] = useLoginMutation();
	const [logout] = useLogoutMutation();

	const [logging, setLogging] = React.useState(false);
	const client = useApolloClient();

	return (
		<div className={styles.container}>
			<Head>
				<title>FanStop - Login</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{loading ? (
				<>
					<Spinner />
				</>
			) : (
				<>
					<section>
						<Flex flexDir="column">
							<Heading as="h3" size="lg">
								Sign In
							</Heading>
							<Box mt="{8}" mx="auto" maxW={800}>
								<Formik
									initialValues={{ email: '', password: '' }}
									onSubmit={async (values, { setErrors }) => {
										const response = await login({
											variables: {
												email: values.email,
												password: values.password,
											},
											update: (cache, { data }) => {
												cache.writeQuery<UserQuery>({
													query: UserDocument,
													data: {
														__typename: 'Query',
														user: data?.login.user,
													},
												});
											},
										});
										if (response.data?.login.errors) {
											console.log('NOT!');
										} else {
											console.log('great success!');
										}
									}}
								>
									{({ isSubmitting }) => (
										<Form>
											<Box mt={4}>
												<Field
													name="email"
													placeholder="email"
													label="Email"
													type="email"
													icon="info"
												/>
											</Box>
											<Box mt={4}>
												<Field
													name="password"
													placeholder="password"
													label="Password"
													type="password"
													icon="lock"
												/>
											</Box>
											<Box textAlign="center">
												<Button
													mt={8}
													type="submit"
													isLoading={isSubmitting}
													colorScheme="blue"
												>
													Sign In
												</Button>
											</Box>
										</Form>
									)}
								</Formik>
							</Box>
						</Flex>
					</section>
					<Box mt={8}>
						{data?.user ? (
							<>
								<p>{data.user._id}</p>
								{data.user.supporting.map((x) => (
									<Link href={`/user/${x._id}`}>
										<a color="blue">{x._id}</a>
									</Link>
								))}
							</>
						) : (
							<p>Not logged in</p>
						)}
						<Box textAlign="center">
							<Button
								type="submit"
								colorScheme="blue"
								isLoading={logging}
								onClick={async () => {
									setLogging(true);
									await logout();
									await client.resetStore();
									setLogging(false);
								}}
							>
								Sign Out
							</Button>
						</Box>
					</Box>
				</>
			)}
		</div>
	);
}

export default withApollo(Login);
