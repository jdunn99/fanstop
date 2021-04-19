import React from "react";

import { withApollo } from "../util/withApollo";
import { useUserQuery } from "../generated/graphql";
import router from "next/router";
const isServer = () => typeof window === "undefined";

/**
 * Loads the User. If they are already authenticated, send them to their profile. Otherwise, send them to login.
 * @returns null
 */
const Index = () => {
  const { data } = useUserQuery({ skip: isServer() });

  React.useEffect(() => {
    if (data)
      data.user ? router.push(`/user/${data.user._id}`) : router.push(`/login`);
  }, [data]);

  return null;
};

export default withApollo(Index);
