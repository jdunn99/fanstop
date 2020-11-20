import React, { useRef, useContext } from 'react';
import {
	Box,
	Link,
	Flex,
	Button,
	Heading,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	useDisclosure,
	Stack,
	Avatar,
} from '@chakra-ui/core';
import NextLink from 'next/link';
import { useUserQuery } from '../generated/graphql';
interface NavbarProps {
	background?: string;
	type?: string;
	shadow?: string;
}
import { NotificationAlert } from './NotificationAlert';
import { AvatarPopover } from './AvatarPopover';
import { FaBell, FaPlusCircle } from 'react-icons/fa';

const NavBody = ({ user }) => {
	return (
		<Flex align="center" color="white">
			{user ? (
				<>
					{user.user?.admin ? (
						<NextLink href="/admin">
							<Button as={Link} mr={4} colorScheme="blue">
								Admin
							</Button>
						</NextLink>
					) : null}

					<NextLink href="/login">
						<Button as={Link} mr={4} colorScheme="blue">
							Dashboard
						</Button>
					</NextLink>
					<NotificationAlert user={user} />
					<NextLink href="/post">
						<Button as={Link} mr={4} colorScheme="blue">
							<FaPlusCircle />
						</Button>
					</NextLink>
					<AvatarPopover user={user} />
				</>
			) : (
				<>
					<NextLink href="/login">
						<Button as={Link} mr={4} colorScheme="blue">
							Sign In
						</Button>
					</NextLink>
				</>
			)}
		</Flex>
	);
};

const NavMobile = ({ user }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();

	return (
		<Flex align="center" color="white">
			<Button
				as={Link}
				mr={4}
				background="transparent"
				ref={btnRef}
				onClick={onOpen}
			>
				☰
			</Button>
			<Drawer placement="top" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />

				<DrawerContent>
					<DrawerHeader>
						<Heading
							as="h3"
							size="lg"
							color="white"
							textAlign="center"
						>
							FanStop
						</Heading>
					</DrawerHeader>
					<DrawerBody>
						<Stack>
							<NextLink href="/about">
								<Button
									as={Link}
									mb={3}
									background="transparent"
								>
									About
								</Button>
							</NextLink>
							<NextLink href="/contact">
								<Button
									as={Link}
									mb={3}
									background="transparent"
								>
									Contact Us
								</Button>
							</NextLink>
							{user ? (
								<>
									{user.admin ? (
										<NextLink href="/admin">
											<Button
												as={Link}
												mb={3}
												background="transparent"
											>
												Admin
											</Button>
										</NextLink>
									) : null}
									<NextLink href="/login">
										<Button
											as={Link}
											background="transparent"
											mb={3}
										>
											Dashboard
										</Button>
									</NextLink>
								</>
							) : (
								<>
									<NextLink href="/schedule">
										<Button
											as={Link}
											mb={3}
											background="transparent"
										>
											Schedule a Demo
										</Button>
									</NextLink>
									<NextLink href="/login">
										<Button
											as={Link}
											mb={3}
											background="transparent"
										>
											Sign In
										</Button>
									</NextLink>
								</>
							)}
							<Button
								as={Link}
								background="transparent"
								ref={btnRef}
								onClick={onClose}
							>
								☰
							</Button>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
};

export const Navbar: React.FC<NavbarProps> = () => {
	const { data, loading } = useUserQuery();

	return loading ? null : (
		<Flex
			zIndex={1}
			top={0}
			bg="rgb(250, 250, 250)"
			p={1}
			background="#3182CE"
			style={{
				boxShadow:
					' 0 0.0625rem 0.5rem 0 rgba(0, 0, 0, 0.04),0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.04)',
			}}
		>
			<Flex flex={1} m="auto" align="center" maxW={1200}>
				<NextLink href="/">
					<Heading as="h3" size="md" color="white" cursor="pointer">
						FanStop
					</Heading>
				</NextLink>
				<Box ml={'auto'}>
					<Box display={['none', 'none', 'flex', 'flex']}>
						<NavBody user={data.user} />
					</Box>
					<Box display={['flex', 'flex', 'none', 'none']}>
						<NavMobile user={data.user} />
					</Box>
				</Box>
			</Flex>
		</Flex>
	);
};
