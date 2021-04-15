import React, { useRef, useContext } from "react";
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
  Badge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/core";
import NextLink from "next/link";
import {
  UserDocument,
  UserQuery,
  useUserQuery,
  useDeleteNotificationMutation,
} from "../generated/graphql";
interface NavbarProps {
  background?: string;
  type?: string;
  shadow?: string;
}
import { AvatarPopover } from "./AvatarPopover";
import { FaBell, FaPlusCircle } from "react-icons/fa";
import { isServer } from "../util/isServer";
import { gql } from "@apollo/client";

const NavBody = ({ data }) => {
  return (
    <Flex align="center" color="white">
      {data && data.user ? (
        <>
          <NotificationAlert
            user={data.user}
            notifications={data.user.notifications}
          />
          <NextLink href="/post">
            <Button title="Create new post" mr={4} colorScheme="blue">
              <FaPlusCircle />
            </Button>
          </NextLink>
          <AvatarPopover user={data.user} />
        </>
      ) : (
        <>
          <NextLink href="/login">
            <Button mr={4} colorScheme="blue">
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
    <Flex align="center" color=";white">
      <Button mr={4} background="transparent" ref={btnRef} onClick={onOpen}>
        ☰
      </Button>
      <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader>
            <Heading as="h3" size="lg" color="white" textAlign="center">
              FanStop
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <Stack>
              <NextLink href="/about">
                <Button mb={3} background="transparent">
                  About
                </Button>
              </NextLink>
              <NextLink href="/contact">
                <Button mb={3} background="transparent">
                  Contact Us
                </Button>
              </NextLink>
              {user ? (
                <>
                  <NextLink href="/login">
                    <Button background="transparent" mb={3}>
                      Dashboard
                    </Button>
                  </NextLink>
                </>
              ) : (
                <>
                  <NextLink href="/schedule">
                    <Button mb={3} background="transparent">
                      Schedule a Demo
                    </Button>
                  </NextLink>
                  <NextLink href="/login">
                    <Button mb={3} background="transparent">
                      Sign In
                    </Button>
                  </NextLink>
                </>
              )}
              <Button background="transparent" ref={btnRef} onClick={onClose}>
                ☰
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
const NOTIFICATION_SUBSCRIPTION = gql`
  subscription Notification($subscriber: String!, $supporting: [String!]) {
    notification(subscriber: $subscriber, supporting: $supporting) {
      _id
      message
      date
    }
  }
`;

const NotificationAlert = ({ user, notifications }) => {
  const [remove] = useDeleteNotificationMutation();

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
                                  ...user,
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
          {notifications.length > 0 ? (
            <Badge
              borderRadius="xl"
              className="top-right dot"
              background="red.500"
              color="#1A202C"
              fontSize="12px"
              boxShadow="dark-lg">
              {notifications.length}
            </Badge>
          ) : null}
        </Menu>
      </div>
    </>
  );
};

export const Navbar: React.FC<NavbarProps> = () => {
  const { data, loading, subscribeToMore } = useUserQuery({ skip: isServer() });
  React.useEffect(() => {
    if (data && data.user) {
      const unsubscribe = subscribeToMore({
        document: NOTIFICATION_SUBSCRIPTION,
        variables: {
          subscriber: data.user._id,
          supporting: data.user.supporters.map((sup) => sup._id),
        },
        updateQuery: (prev, { subscriptionData }) => {
          console.log(subscriptionData);
          if (!subscriptionData.data) return prev;
          const newNotification = subscriptionData.data as any;
          return Object.assign({}, prev, {
            user: {
              ...data.user,
              notifications: [
                ...data.user.notifications,
                newNotification.notification,
              ],
            },
          });
        },
      });
      return () => unsubscribe();
    }
  }, [data]);
  return loading ? null : (
    <Flex
      zIndex={9}
      top={0}
      bg="rgb(250, 250, 250)"
      p={1}
      background="#3182CE"
      style={{
        boxShadow:
          " 0 0.0625rem 0.5rem 0 rgba(0, 0, 0, 0.04),0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.04)",
      }}>
      <Flex flex={1} m="auto" align="center" maxW={1200}>
        <NextLink href="/">
          <Heading as="h3" size="md" color="white" cursor="pointer">
            FanStop
          </Heading>
        </NextLink>
        <Box ml={"auto"}>
          <Box display={["none", "none", "flex", "flex"]}>
            <NavBody data={data} />
          </Box>

          <Box display={["flex", "flex", "none", "none"]}></Box>
        </Box>
      </Flex>
    </Flex>
  );
};
function remove(arg0: {
  variables: { id: any };
  update: (cache: any, { data: deletedData }: { data: any }) => void;
}) {
  throw new Error("Function not implemented.");
}
