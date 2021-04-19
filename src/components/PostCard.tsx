import React from "react";
import {
  Heading,
  Box,
  Text,
  Stack,
  Flex,
  ChakraStyleProps,
} from "@chakra-ui/core";
import { FaChevronRight } from "react-icons/fa";
import NextLink from "next/link";

interface PostCardProps extends ChakraStyleProps {
  title: string;
  text: string;
  href?: string;
  author?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  text,
  href,
  author,
}) => {
  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };
  return (
    <NextLink href={href}>
      <Box className="post-card">
        <Box
          w={[300, 450, 600]}
          m="auto"
          background="#EDF2F7"
          p={4}
          rounded="lg"
          style={{ cursor: "pointer" }}
          _hover={{ background: "#E2E8F0" }}>
          <Heading
            as="h2"
            size="lg"
            color="primary.800"
            opacity={0.8}
            display="block"
            lineHeight={1.5}
            textAlign={["center", "center", "left", "left"]}>
            {title}
          </Heading>
          <Box mb={4}>
            <Text
              mb={6}
              color="gray.500"
              textAlign={["center", "center", "left", "left"]}>
              {truncate(text, 281)}
            </Text>
            {author && <Text>Posted by: {author}</Text>}
          </Box>
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
              <Text>Read More</Text>
              <Flex align="center">
                <FaChevronRight />
              </Flex>
            </Stack>
          </Box>
        </Box>
      </Box>
    </NextLink>
  );
};