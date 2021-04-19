import { Button } from "@chakra-ui/core";
import React from "react";
import { Type } from "typescript";
import {
  FetchFeedQuery,
  FetchUserQuery,
  UserQuery,
  UsersQuery,
} from "../generated/graphql";

interface PaginationProps {
  fetchUserData?: FetchUserQuery;
  userData?: UserQuery;
  usersData?: UsersQuery;
  fetch?: boolean;
  user?: boolean;
  users?: boolean;
  fetchMore: any;
  feed?: boolean;
  feedData?: FetchFeedQuery;
}

type PaginateProps = {
  fetchMore: any;
  data: FetchUserQuery | FetchFeedQuery | UserQuery;
};

const PaginateSelf: React.FC<PaginateProps> = ({ data, fetchMore }) => {
  return (
    <Button
      onClick={() => {
        fetchMore({
          variables: {
            cursor: (data as UserQuery).user.posts[
              (data as UserQuery).user.posts.length - 1
            ].createdAt,
          },
          updateQuery: (_, { fetchMoreResult }) => {
            const temp = fetchMoreResult as UserQuery;
            return {
              __typename: "Query",
              user: {
                ...(data as UserQuery).user,
                posts: [...(data as UserQuery).user.posts, ...temp.user.posts],
              },
            };
          },
        });
      }}>
      Load More Posts
    </Button>
  );
};

const PaginateUsers: React.FC<PaginateProps> = ({ data, fetchMore }) => {
  return (
    <Button
      onClick={() => {
        fetchMore({
          variables: {
            cursor: (data as UsersQuery).users[
              (data as UsersQuery).users.length - 1
            ]._id,
          },
          updateQuery: (_, { fetchMoreResult }) => {
            const temp = fetchMoreResult as UsersQuery;
            return {
              __typename: "Query",
              users: [...(data as UsersQuery).users, ...temp.users],
            };
          },
        });
      }}>
      Load More Users
    </Button>
  );
};

/**
 * Pagination if viewing another profile
 */
const PaginateUser: React.FC<PaginateProps> = ({ data, fetchMore }) => {
  return (
    <Button
      onClick={() => {
        fetchMore({
          variables: {
            id: (data as FetchUserQuery).fetchUser._id,
            cursor: (data as FetchUserQuery).fetchUser.posts[
              (data as FetchUserQuery).fetchUser.posts.length - 1
            ].createdAt,
          },
          updateQuery: (_, { fetchMoreResult }) => {
            const temp = fetchMoreResult as FetchUserQuery;
            return {
              __typename: "Query",
              fetchUser: {
                ...(data as FetchUserQuery).fetchUser,
                posts: [
                  ...(data as FetchUserQuery).fetchUser.posts,
                  ...temp.fetchUser.posts,
                ],
              },
            };
          },
        });
      }}>
      Load More Posts
    </Button>
  );
};

/**
 * Pagination for a User's feed.
 */
const PaginateFeed: React.FC<PaginateProps> = ({ data, fetchMore }) => {
  return (
    <Button
      onClick={() => {
        fetchMore({
          variables: {
            cursor: (data as FetchFeedQuery).feed[
              (data as FetchFeedQuery).feed.length - 1
            ].createdAt,
          },
          updateQuery: (_, { fetchMoreResult }) => {
            const temp = fetchMoreResult as FetchFeedQuery;
            return {
              __typename: "Query",
              feed: [...(data as FetchFeedQuery).feed, ...temp.feed],
            };
          },
        });
      }}>
      Load More Posts
    </Button>
  );
};
export const Pagination: React.FC<PaginationProps> = (props) => {
  return (
    <>
      {props.fetch && (
        <PaginateUser data={props.fetchUserData} fetchMore={props.fetchMore} />
      )}
      {props.user && (
        <PaginateSelf data={props.userData} fetchMore={props.fetchMore} />
      )}
      {props.feed && (
        <PaginateFeed data={props.feedData} fetchMore={props.fetchMore} />
      )}
      {props.users && (
        <PaginateUsers data={props.usersData} fetchMore={props.fetchMore} />
      )}
    </>
  );
};
