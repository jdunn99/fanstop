import { Heading, Box, Text } from '@chakra-ui/core';
import React from 'react';

interface PostItemProps {
	value: string;
	type: string; // TODO: Convert to enum
	index: number;
	key: number;
}

const PostItem: React.FC<PostItemProps> = (props) => {
	const handleType = () => {
		switch (props.type) {
			case 'title': {
				return (
					<Heading className="editable-content-title">
						{props.value}
					</Heading>
				);
			}
			case 'text': {
				return (
					<Text className="editable-content-text" color="gray.500">
						{props.value}
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
