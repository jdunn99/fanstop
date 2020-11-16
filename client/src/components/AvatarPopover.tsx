import React from 'react';
import {
	Button,
	Avatar,
	Flex,
	Menu,
	MenuButton,
	MenuList,
	Link,
	MenuItem,
} from '@chakra-ui/core';
import { User } from '../generated/graphql';
import { BsGearFill, BsFillPersonFill } from 'react-icons/bs';
import { FaDoorOpen } from 'react-icons/fa';
import { BiSupport } from 'react-icons/bi';
interface AvatarPopoverProps {
	user: User;
}
import { useRouter } from 'next/router';

export const AvatarPopover: React.FC<AvatarPopoverProps> = ({ user }) => {
	const router = useRouter();

	return (
		<Menu placement="bottom" isLazy>
			<MenuButton>
				<Button colorScheme="blue">
					<Avatar size="sm" cursor="pointer" />
				</Button>
			</MenuButton>
			<MenuList color="black">
				<MenuItem onClick={() => router.push(`/user/${user._id}`)}>
					<Flex
						as={Link}
						m="auto"
						justify="space-between"
						align="center"
						cursor="pointer"
						w={200}
					>
						<p>My Profile</p>
						<BsFillPersonFill />
					</Flex>
				</MenuItem>
				<MenuItem>
					<Flex
						justify="space-between"
						align="center"
						cursor="pointer"
						w={200}
					>
						<p>Settings</p>
						<BsGearFill />
					</Flex>
				</MenuItem>
				<MenuItem>
					<Flex
						justify="space-between"
						align="center"
						cursor="pointer"
						w={200}
					>
						<p>Support</p>
						<BiSupport />
					</Flex>
				</MenuItem>
				<MenuItem>
					<Flex
						justify="space-between"
						align="center"
						cursor="pointer"
						w={200}
					>
						<p>Log Out</p>
						<FaDoorOpen />
					</Flex>
				</MenuItem>
			</MenuList>
		</Menu>
	);
};
