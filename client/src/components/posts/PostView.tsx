import React from 'react';
import { BuildType } from '../../util/types';
import { Stack, Box, Heading, Text } from '@chakra-ui/core';

interface PostItemProps {
	value: string;
	type: string; // TODO: Convert to enum
}

const PostItem: React.FC<PostItemProps> = ({ value, type }) => {
	const handleType = () => {
		switch (type) {
			case 'title': {
				return (
					<Heading className="editable-content-title">
						{value}
					</Heading>
				);
			}
			case 'text': {
				return (
					<Text className="editable-content-text" color="gray.500">
						{value}
					</Text>
				);
			}
		}
	};

	return (
		<Box w="100%" rounded="lg">
			{handleType()}
		</Box>
	);
};

interface PostViewProps {
	buildState?: BuildType[];
}

export const PostView: React.FC<PostViewProps> = ({ buildState }) => {
	return (
		<Stack w={1200} m="auto" p={4} mt={9} spacing={4}>
			{buildState.map((x, i) => (
				<div key={i}>
					<PostItem value={x.value} key={i} type={x.type} />
				</div>
			))}
		</Stack>
	);
};
