import React from 'react';
import { useRouter } from 'next/router';
import { useUserQuery } from '../../../../generated/graphql';
import { Spinner, Box } from '@chakra-ui/core';
import { withApollo } from '../../../../util/withApollo';
import { Navbar } from '../../../../components/Navbar';
interface newProps {}

const New: React.FC<newProps> = ({}) => {
	const router = useRouter();
	const { data, loading } = useUserQuery();

	const { id } = router.query;

	return loading || !id ? (
		<Spinner />
	) : data.user._id === id ? (
		<Box>
			<Navbar />
			<p>{data.user._id}</p>
		</Box>
	) : (
		<Box>You are not allowed to view this page! </Box>
	);
};

export default withApollo(New);
