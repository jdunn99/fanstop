import React from "react";
import {
  Button,
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/core";
import { useLogoutMutation, User } from "../generated/graphql";
import { BsGearFill, BsFillPersonFill } from "react-icons/bs";
import { FaDoorOpen } from "react-icons/fa";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
interface AvatarPopoverProps {
  user: User;
}

export const AvatarPopover: React.FC<AvatarPopoverProps> = ({ user }) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const client = useApolloClient();

  return (
    <Menu placement="bottom" isLazy>
      <MenuButton>
        <Button colorScheme="blue">
          <Avatar
            src={user.image ? user.image : ""}
            size="sm"
            cursor="pointer"
          />
        </Button>
      </MenuButton>
      <MenuList color="black">
        <MenuItem onClick={() => router.push(`/`)}>
          <Flex
            m="auto"
            justify="space-between"
            align="center"
            cursor="pointer"
            w={200}>
            <p>My Profile</p>
            <BsFillPersonFill />
          </Flex>
        </MenuItem>
        <MenuItem onClick={() => router.push("/edit")}>
          <Flex justify="space-between" align="center" cursor="pointer" w={200}>
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
            onClick={async () => {
              const response = await logout();
              await client.clearStore();
              if (response.data.logout) router.push("/");
            }}>
            <p>Log Out</p>
            <FaDoorOpen />
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
