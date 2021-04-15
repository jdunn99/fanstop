import React from "react";
import { useRouter } from "next/router";
import { isServer } from "../../../../util/isServer";
import { useFetchPostQuery, useUserQuery } from "../../../../generated/graphql";
import { Navbar } from "../../../../components/Navbar";
import { UserCard } from "../../../../components/UserCard";
import { withApollo } from "../../../../util/withApollo";
import { LikeButton } from "../../../../components/posts/LikeButton";
import gql from "graphql-tag";
import { Loading } from "../../../../components/Loading";

/** Type Declarations */

interface indexProps {
  post: any;
}

const LIKE_SUBSCRIPTION = gql`
  subscription Like {
    likeSubscription
  }
`;

const Post: React.FC<indexProps> = () => {
  /** State */
  const [payload, setPayload] = React.useState("");

  /** Misc Variables */
  const router = useRouter();
  const { id, post } = router.query;

  /** GraphQL */
  const { data, loading, subscribeToMore } = useFetchPostQuery({
    variables: { id: post as string },
    skip: isServer(),
  });

  const { data: dataUser, loading: loadingUser } = useUserQuery({
    skip: isServer(),
  });

  /** useEffect Hooks */
  // Handles initial logic
  React.useEffect(() => {
    // check if the user is viewing their own profile and set payload accordingly
    if (dataUser) {
      if (dataUser.user && dataUser.user._id === id) setPayload("Supporting");
      else if (!dataUser.user) setPayload("Not signed in");
      else {
        const result = dataUser.user.supporting.some((x) => x["_id"] === id);
        if (result)
          // if the user is in the array then we add them
          setPayload("Supporting");
      }
    }
  }, [loadingUser, id]);

  /**
   * Like Subscription Handler
   */
  React.useEffect(() => {
    subscribeToMore({
      document: LIKE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return Object.assign({}, prev, {
          post: {
            like: subscriptionData.data,
          },
        });
      },
    });
  }, []);

  /**
   * Handles whether or not the User is authorized to view the Post.
   */
  const HandlePayload = () => {
    switch (payload) {
      case "Not signed in": {
        return null;
      }

      case "Supporting": {
        return loading || !post ? (
          <Loading />
        ) : (
          <>
            <Navbar />
            <UserCard
              name={data.post.poster.name}
              supporting={data.post.poster.supporting.length}
              supporters={data.post.poster.supporters.length}
              href={`/user/${data.post.poster._id}`}
            />

            <LikeButton data={data} />
          </>
        );
      }

      default: {
        return null;
      }
    }
  };

  return <HandlePayload />;
};

export default withApollo(Post);
