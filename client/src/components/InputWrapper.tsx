import React from "react";
import * as CSS from "csstype";
import {
  Box,
  ChakraStyleProps,
  Flex,
  Heading,
  ResponsiveValue,
} from "@chakra-ui/core";

interface WrapperProps {
  heading?: string;
}

export const InputWrapper: React.FC<WrapperProps> = ({ heading, children }) => {
  return (
    <Box w={[300, 350, 400]}>
      {!!heading && <Heading size="lg">{heading}</Heading>}
      <Box mx="auto">{children}</Box>
    </Box>
  );
};
