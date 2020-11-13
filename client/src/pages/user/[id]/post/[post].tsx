import React from 'react';
import { useRouter } from 'next/router';
import { isServer } from '../../../../util/isServer';
import { useFetchPostQuery, useUserQuery } from '../../../../generated/graphql';
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Spinner,
} from '@chakra-ui/core';
import styles from '../../../../styles/Home.module.css';
import Head from 'next/head';
import { Navbar } from '../../../../components/Navbar';
import { UserCard } from '../../../../components/UserCard';
import { crumbType } from '../../../../util/crumbType';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { withApollo } from '../../../../util/withApollo';

interface indexProps {
	post: any;
}

const Post: React.FC<indexProps> = () => {
	const router = useRouter();
	const { post } = router.query;

	const { data: dataUser, loading: loadingUser } = useUserQuery({
		skip: isServer(),
	});

	const { data, loading } = useFetchPostQuery({
		skip: isServer(),
		variables: { id: post as string },
	});

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
			</header>
		</>
	) : (
		<p>No post ☹️</p>
	);
};

export default withApollo(Post);
