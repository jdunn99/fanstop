import React from 'react';
import { Heading, Box, Text, Stack, Flex, Avatar } from '@chakra-ui/core';
import { FaChevronRight } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface PostCardProps {
	name: string;
	text: string;
	href?: string;
}

export const SupporterCard: React.FC<PostCardProps> = ({
	name,
	text,
	href,
}) => {
	const router = useRouter();

	const truncate = (str: string, n: number) => {
		return str.length > n ? str.substr(0, n - 1) + '...' : str;
	};

	return (
		<Box
			w={300}
			m="auto"
			background="#EDF2F7"
			rounded="lg"
			style={{ cursor: 'pointer' }}
			_hover={{ background: '#E2E8F0' }}
			onClick={() => router.replace(href)}
		>
			<Flex
				height={100}
				align="center"
				justify="center"
				style={{
					backgroundImage: `url(data:image/jpeg;base64,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)`,
				}}
				roundedTop="lg"
			>
				<Avatar />
			</Flex>
			<Box p={4}>
				<Heading
					as="h2"
					size="md"
					color="primary.800"
					opacity={0.8}
					display="block"
					lineHeight={1.5}
					textAlign={['center', 'center', 'left', 'left']}
				>
					{name}
				</Heading>
				<Box mb={4}>
					<Text
						mb={6}
						color="gray.500"
						textAlign={['center', 'center', 'left', 'left']}
					>
						{truncate(text, 281)}
					</Text>
				</Box>
				<Box as="span" color="gray.600" fontSize="sm">
					<Stack
						isInline
						fontWeight="bold"
						textTransform="uppercase"
						fontSize="sm"
						letterSpacing="wide"
						color="blue.500"
						textAlign={['center', 'center', 'left', 'left']}
						mt={3}
					>
						<Text>Read More</Text>
						<Flex align="center">
							<FaChevronRight />
						</Flex>
					</Stack>
				</Box>
			</Box>
		</Box>
	);
};
