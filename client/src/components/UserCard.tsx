import React from 'react';
import { Box, Button, Flex, Avatar, Text } from '@chakra-ui/core';
import NextLink from 'next/link';

interface UserCardProps {
	name: string;
	supporting: number;
	supporters: number;
	payload?: string;
	handleFetch?: any; // TODO: fix any type
	href?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
	name,
	supporting,
	supporters,
	payload,
	href = '',
	handleFetch,
}) => {
	const HandlePayload = () => {
		return payload ? (
			<>
				<Button
					size="md"
					type="submit"
					colorScheme="blue"
					onClick={handleFetch}
				>
					{payload}
				</Button>
			</>
		) : (
			<Button
				size="md"
				type="submit"
				colorScheme="blue"
				onClick={handleFetch}
			>
				{payload}
			</Button>
		);
	};

	return (
		<Box
			overflow="hidden"
			p={2}
			background="#CEEDFF"
			w="100%"
			style={{
				boxShadow:
					' 0 0.0625rem 0.5rem 0 rgba(0, 0, 0, 0.04),0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.04)',
			}}
		>
			<Box maxW={1200} m="auto">
				<Flex justifyContent="space-between" align="center">
					<NextLink href={href}>
						<Flex align="center" cursor="pointer">
							<Avatar />
							<Text
								fontWeight="semibold"
								fontSize="md"
								mx={3}
								letterSpacing="wide"
								textAlign={['center', 'center', 'left', 'left']}
							>
								{name}
							</Text>
						</Flex>
					</NextLink>

					<Flex align="center">
						<Text
							fontWeight="semibold"
							fontSize="sm"
							letterSpacing="wide"
							px={4}
							textAlign={['center', 'center', 'left', 'left']}
						>
							{supporting} supporting
						</Text>
						<Text
							fontWeight="semibold"
							fontSize="sm"
							px={4}
							letterSpacing="wide"
							textAlign={['center', 'center', 'left', 'left']}
						>
							{supporters} supporters
						</Text>
						{handleFetch ? <HandlePayload /> : null}
					</Flex>
				</Flex>
			</Box>
		</Box>
	);
};
