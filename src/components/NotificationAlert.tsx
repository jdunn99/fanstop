import React from "react";
import {
  User,
  useNotificationSubscription,
  useDeleteNotificationMutation,
  UserQuery,
  UserDocument,
  useUserQuery,
} from "../generated/graphql";
import {
  Button,
  Badge,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/core";
import { FaBell } from "react-icons/fa";
import gql from "graphql-tag";
import { isServer } from "../util/isServer";

interface NotificationAlertProps {}

const NOTIFICATION_SUBSCRIPTION = gql`
  subscription Notification($subscriber: String!, $supporting: [String!]) {
    notification(subscriber: $subscriber, supporting: $supporting) {
      _id
      message
      date
    }
  }
`;

export const NotificationAlert: React.FC<NotificationAlertProps> = () => {
  const { data, subscribeToMore } = useUserQuery({
    skip: isServer(),
  });
  const [remove] = useDeleteNotificationMutation();

  React.useEffect(() => {
    subscribeToMore({
      document: NOTIFICATION_SUBSCRIPTION,
      variables: {
        subscriber: data.user._id,
        supporting: data.user.supporters.map((sup) => sup._id),
      },
    });
  }, []);

  React.useEffect(() => {
    if (data && data.user) console.log(data.user.notifications);
  }, [data]);

  return (
    data &&
    data.user && (
      <>
        <div className="contained">
          <Menu placement="bottom" isLazy>
            <MenuButton>
              <Button mr={4} colorScheme="blue">
                <FaBell />
              </Button>
            </MenuButton>
            <MenuList color="black">
              {data.user.notifications.length > 0 ? (
                data.user.notifications.map((noti) => (
                  <MenuItem key={noti._id}>
                    {console.log(noti._id)}
                    <Flex
                      justify="space-between"
                      align="center"
                      cursor="pointer"
                      w={200}>
                      <p>{noti.message}</p>
                      <Button
                        colorScheme="red"
                        size="xs"
                        onClick={async () => {
                          const response = await remove({
                            variables: { id: noti._id },
                            update: (cache, { data: deletedData }) => {
                              cache.writeQuery<UserQuery>({
                                query: UserDocument,
                                data: {
                                  __typename: "Query",
                                  user: {
                                    ...data.user,
                                    notifications:
                                      deletedData.deleteNotification
                                        .notifications,
                                  },
                                },
                              });
                            },
                          });
                        }}>
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
            {data.user.notifications.length > 0 ? (
              <Badge
                borderRadius="xl"
                className="top-right dot"
                background="red.500"
                color="#1A202C"
                fontSize="12px"
                boxShadow="dark-lg">
                {data.user.notifications.length}
              </Badge>
            ) : null}
          </Menu>
        </div>
      </>
    )
  );
};
