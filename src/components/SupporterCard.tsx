import React from "react";
import { Heading, Box, Text, Stack, Flex, Avatar } from "@chakra-ui/core";
import { FaChevronRight } from "react-icons/fa";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface PostCardProps {
  name: string;
  href?: string;
  image: string;
}

export const SupporterCard: React.FC<PostCardProps> = ({
  name,
  href,
  image,
}) => {
  const router = useRouter();
  return (
    <Box
      w={300}
      m="auto"
      background="#EDF2F7"
      rounded="lg"
      style={{ cursor: "pointer" }}
      _hover={{ background: "#E2E8F0" }}
      onClick={() => router.replace(href)}>
      <Flex
        height={100}
        align="center"
        justify="center"
        background="blue.500"
        roundedTop="lg">
        <Avatar size="lg" src={image} />
      </Flex>
      <Box p={4}>
        <Heading
          as="h2"
          size="md"
          color="primary.800"
          opacity={0.8}
          display="block"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}>
          {name}
        </Heading>

        <Box as="span" color="gray.600" fontSize="sm">
          <Stack
            isInline
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="sm"
            letterSpacing="wide"
            color="blue.500"
            textAlign={["center", "center", "left", "left"]}
            mt={3}>
            <Text>View Profile</Text>
            <Flex align="center">
              <FaChevronRight />
            </Flex>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
