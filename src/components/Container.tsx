import React from "react";
import { Box } from "@chakra-ui/core";
import styles from "../styles/Home.module.css";

interface ContainerProps {
  min?: string;
}

export const Container: React.FC<ContainerProps> = ({
  min = "100vh",
  children,
}) => {
  return (
    <Box>
      <Box className={styles.container} style={{ minHeight: min }}>
        {children}
      </Box>
    </Box>
  );
};
