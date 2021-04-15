import { Spinner } from "@chakra-ui/core";
import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";

export class Loading extends React.PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>FanStop - Loading...</title>
        </Head>
        <Spinner />
      </div>
    );
  }
}
