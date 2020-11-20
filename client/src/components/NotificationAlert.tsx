import React from 'react';
import {
	User,
	useNotificationSubscription,
	useDeleteNotificationMutation,
	UserQuery,
	UserDocument,
} from '../generated/graphql';
import {
	Button,
	Badge,
	Flex,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from '@chakra-ui/core';
import { FaBell } from 'react-icons/fa';

interface NotificationAlertProps {
	user: User;
}

export const NotificationAlert: React.FC<NotificationAlertProps> = ({
	user,
}) => {
	console.log(user.notifications);

	const [remove] = useDeleteNotificationMutation();
	const { data, loading } = useNotificationSubscription();
	const [notifications, setNotifications] = React.useState<any>([
		...user.notifications,
	]);

	React.useEffect(() => {
		if (!loading) setNotifications([...notifications, data.notify]);
	}, [data]);

	console.log(notifications);

	return (
		<>
			<div className="contained">
				<Menu placement="bottom" isLazy>
					<MenuButton>
						<Button mr={4} colorScheme="blue">
							<FaBell />
						</Button>
					</MenuButton>
					<MenuList color="black">
						{notifications.length > 0 ? (
							notifications.map((noti) => (
								<MenuItem>
									<Flex
										justify="space-between"
										align="center"
										cursor="pointer"
										w={200}
									>
										<p>{noti.message}</p>
										<Button
											colorScheme="red"
											size="xs"
											onClick={async () => {
												const response = await remove({
													variables: { id: noti._id },
												});

												console.log(
													response.data
														.deleteNotification
														.notifications
												);

												setNotifications(
													response.data
														.deleteNotification
														.notifications
												);
											}}
										>
											x
										</Button>
									</Flex>
								</MenuItem>
							))
						) : (
							<MenuItem>
								<p>No new notifications...</p>
							</MenuItem>
						)}
					</MenuList>
					{notifications.length > 0 ? (
						<Badge
							borderRadius="xl"
							className="top-right dot"
							background="red.500"
							color="#1A202C"
							fontSize="12px"
							boxShadow="dark-lg"
						>
							{notifications.length}
						</Badge>
					) : null}
				</Menu>
			</div>
		</>
	);
};
