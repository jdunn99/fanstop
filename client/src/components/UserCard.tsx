import React from "react";
import { Box, Button, Flex, Avatar, Text } from "@chakra-ui/core";
import NextLink from "next/link";

interface UserCardProps {
  name: string;
  supporting: number;
  supporters: number;
  payload?: string;
  handleFetch?: any;
  href?: string;
}

/**
 *
 * @param {string} name - The name of the User
 * @param {number} supporting - The number of Users the User is supporting
 * @param {number} supporters - The number of supporters
 * @param {string} payload -
 * @returns
 */
export const UserCard: React.FC<UserCardProps> = ({
  name,
  supporting,
  supporters,
  payload,
  href = "",
  handleFetch,
}) => {
  const HandlePayload = () => {
    return payload ? (
      <Button size="md" type="submit" colorScheme="blue" onClick={handleFetch}>
        {payload}
      </Button>
    ) : (
      <Button size="md" type="submit" colorScheme="blue" onClick={handleFetch}>
        {payload}
      </Button>
    );
  };

  const StyledText = ({ size, children }) => {
    return (
      <Text
        fontWeight="semibold"
        fontSize={size}
        mx={3}
        letterSpacing="wide"
        textAlign={["center", "center", "left", "left"]}>
        {children}
      </Text>
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
          " 0 0.0625rem 0.5rem 0 rgba(0, 0, 0, 0.04),0 0.0625rem 0.3125rem 0 rgba(0, 0, 0, 0.04)",
      }}>
      <Box maxW={1200} m="auto">
        <Flex justifyContent="space-between" align="center">
          <NextLink href={href}>
            <Flex align="center" cursor="pointer">
              <Avatar />
              <StyledText size="md">{name}</StyledText>
            </Flex>
          </NextLink>

          <Flex align="center">
            <StyledText size="sm">{supporting} supporting</StyledText>
            <StyledText size="sm">{supporters} supporters</StyledText>
            {handleFetch ? <HandlePayload /> : null}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
