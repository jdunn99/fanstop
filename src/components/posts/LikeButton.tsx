import React from "react";
import { Button, ChakraStyleProps, Flex } from "@chakra-ui/core";
import { FaRegThumbsUp } from "react-icons/fa";
import { FetchPostQuery, useLikePostMutation } from "../../generated/graphql";

interface LikeButtonProps {
  data: FetchPostQuery;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ data }) => {
  const [like] = useLikePostMutation();
  return (
    <Flex mb={5} textAlign="center" align="center" justify="center">
      <Button
        onClick={async () => {
          await like({ variables: { id: data.post._id } });
        }}
        size="sm"
        colorScheme="blue"
        mx={2}>
        <FaRegThumbsUp />
      </Button>
      <p>{data.post.likes}</p>
    </Flex>
  );
};
