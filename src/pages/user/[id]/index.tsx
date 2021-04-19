import { useRouter } from "next/router";
import React, { SetStateAction } from "react";
import {
  useUserQuery,
  useSupporterMutation,
  FetchUserQuery,
  FetchUserDocument,
  UserQuery,
  useFetchFeedLazyQuery,
  useFetchUserLazyQuery,
  FetchFeedQuery,
  useDeletePostMutation,
  useUserLazyQuery,
  UserDocument,
  useUsersLazyQuery,
} from "../../../generated/graphql";
import styles from "../../../styles/Home.module.css";
import { Flex, Spinner, Text, Stack, Button, Box } from "@chakra-ui/core";
import Head from "next/head";
import { Navbar } from "../../../components/Navbar";
import { UserCard } from "../../../components/UserCard";
import { PostCard } from "../../../components/PostCard";
import { SupporterCard } from "../../../components/SupporterCard";
import { isServer } from "../../../util/isServer";
import { withApollo } from "../../../util/withApollo";
import NextLink from "next/link";
import { Loading } from "../../../components/Loading";
import { BsPencilSquare } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import {
  EditButtons,
  EditCard,
  Editable,
} from "../../../components/posts/Editing";
import { Pagination } from "../../../components/Pagination";

interface UserProfileProps {
  dataUser: UserQuery;
  id: string;
}

interface TabProps {
  active: string;
  setActive: React.Dispatch<SetStateAction<string>>;
  fields: string[];
}

const ProfileTab: React.FC<TabProps> = ({ active, setActive, fields }) => {
  return (
    <Flex gridColumnGap={8}>
      {fields.map((field) => (
        <Box
          key={field}
          borderBottom={active === field ? "2px solid black" : "none"}
          p={2}
          cursor="pointer"
          onClick={() => setActive(field)}>
          <Text fontWeight={active === field ? 600 : 400}>{field}</Text>
        </Box>
      ))}
    </Flex>
  );
};

const User = () => {
  /** State */
  const [payload, setPayload] = React.useState<string>("");
  const [active, setActive] = React.useState<string>("");

  /** GraphQL */
  const {
    data: dataUser,
    loading: loadingUser,
    fetchMore: fetchMoreUser,
  } = useUserQuery({
    skip: isServer(),
  });

  const [
    fetchFeed,
    { data: feedData, loading: loadingFeed, fetchMore: fetchMoreFeed },
  ] = useFetchFeedLazyQuery();

  const [
    fetchUsers,
    { data: users, loading: loadingUsers, fetchMore: fetchMoreUsers },
  ] = useUsersLazyQuery();
  const [fetchUser, { data, loading, fetchMore }] = useFetchUserLazyQuery();
  const [handleSupporter] = useSupporterMutation();
  const [deletePost] = useDeletePostMutation();

  /** Misc Variables */
  const router = useRouter();
  const { id } = router.query;

  /** useEffect Hooks */

  /** Handles inital logic */
  React.useEffect(() => {
    // check if the user is viewing their own profile and set payload accordingly
    console.log(id);
    if (dataUser) {
      if (dataUser.user && dataUser.user._id === id) {
        setPayload("Edit Profile");
        setActive("My Posts");
      } else if (!dataUser.user) setPayload("Not signed in");
      else {
        // not viewing their own profile - load this instead
        fetchUser({ variables: { id: id as string } });
        const result = dataUser.user.supporting.some((x) => x["_id"] === id);
        if (result) {
          // if the user is in the array then we add them
          setActive("Posts");
          setPayload("Supporting");
        } else {
          setPayload("Support");
        }
      }
    }
    console.log(payload);
  }, [dataUser, id]);

  /** Load the Feed whenever necessary */
  React.useEffect(() => {
    if (active === "Feed") fetchFeed();
    switch (active) {
      case "Feed":
        fetchFeed();
        return;
      case "All Users":
        fetchUsers();
        return;
      default:
        return;
    }
  }, [active]);

  /**
   * Fires the handle supporter mutation
   * @param {string} _id - The ID of the supporter.
   * @param {boolean} add - Whether or not the User is a supporter.
   */
  const HandleSupportFetch = async (_id: string, add: boolean) => {
    await handleSupporter({
      variables: {
        id: _id,
        add: add,
      },
      update: (cache, { data }) => {
        cache.writeQuery<FetchUserQuery>({
          query: FetchUserDocument,
          data: {
            __typename: "Query",
            fetchUser: data?.handleSupporter.user,
          },
        });
      },
    });
    payload === "Supporting" ? setPayload("Support") : setPayload("Supporting");
  };

  /** Local Components */

  /**
   * Pagination if viewing their own profile
   */
  const PaginateSelf = () => {
    return (
      <Button
        onClick={() => {
          fetchMoreUser({
            variables: {
              cursor:
                dataUser.user.posts[dataUser.user.posts.length - 1].createdAt,
            },
            updateQuery: (_, { fetchMoreResult }) => {
              const temp = fetchMoreResult as UserQuery;
              return {
                __typename: "Query",
                user: {
                  ...dataUser.user,
                  posts: [...dataUser.user.posts, ...temp.user.posts],
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
   * Pagination if viewing another profile
   */
  const PaginateUser = () => {
    return (
      <Button
        onClick={() => {
          fetchMore({
            variables: {
              id: data.fetchUser._id,
              cursor:
                data.fetchUser.posts[data.fetchUser.posts.length - 1].createdAt,
            },
            updateQuery: (_, { fetchMoreResult }) => {
              const temp = fetchMoreResult as FetchUserQuery;
              return {
                __typename: "Query",
                fetchUser: {
                  ...data.fetchUser,
                  posts: [...data.fetchUser.posts, ...temp.fetchUser.posts],
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
  const PaginateFeed = () => {
    return (
      <Button
        onClick={() => {
          fetchMoreFeed({
            variables: {
              cursor: feedData.feed[feedData.feed.length - 1].createdAt,
            },
            updateQuery: (_, { fetchMoreResult }) => {
              const temp = fetchMoreResult as FetchFeedQuery;
              return {
                __typename: "Query",
                feed: [...feedData.feed, ...temp.feed],
              };
            },
          });
        }}>
        Load More Posts
      </Button>
    );
  };

  /**
   * A container for holding the content on the Page.
   */
  const PostContainer = ({ children }) => {
    return (
      <Flex
        flexDir="column"
        align="center"
        flex={1}
        justify="center"
        overflow="hidden"
        p={4}
        gridRowGap={8}
        mt={9}>
        {children}
      </Flex>
    );
  };

  const HandleRender = () => {
    switch (active) {
      case "My Posts":
        return (
          <Stack spacing={8}>
            {dataUser.user.posts.length === 0 && (
              <Text>You have not made any posts.</Text>
            )}
            <NextLink href="/post">
              <Button colorScheme="blue">Add new post</Button>
            </NextLink>
            {dataUser.user.posts.map((post) => (
              <Editable
                key={post._id}
                title={post.title}
                text={post.desc}
                href={`/user/${id}/post/${post._id.toString()}`}
                id={post._id}
                dataUser={dataUser}
              />
            ))}
            {dataUser.user.posts.length > 0 && (
              <Pagination user userData={dataUser} fetchMore={fetchMoreUser} />
            )}
          </Stack>
        );
      case "Posts":
        return data ? (
          <Stack spacing={8} className="post-stack">
            {data.fetchUser.posts.map((post) => (
              <PostCard
                key={post._id}
                title={post.title}
                text={post.desc}
                href={`/user/${id}/post/${post._id.toString()}`}
              />
            ))}
            {data.fetchUser.posts.length > 0 && (
              <Pagination fetch fetchUserData={data} fetchMore={fetchMore} />
            )}
          </Stack>
        ) : null;
      case "Feed":
        return (
          <Stack spacing={8}>
            {feedData && feedData.feed ? (
              feedData.feed.length > 0 ? (
                <>
                  {feedData.feed.map((post) => (
                    <PostCard
                      key={post._id}
                      title={post.title}
                      author={post.author ? post.author : undefined}
                      href={`/user/${id}/post/${post._id.toString()}`}
                      text="H"
                    />
                  ))}
                  <Pagination
                    feed
                    feedData={feedData}
                    fetchMore={fetchMoreFeed}
                  />
                </>
              ) : (
                <Text>Your feed is empty.</Text>
              )
            ) : (
              <Spinner />
            )}
          </Stack>
        );
      case "Supporting":
        return (
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            gridColumnGap={8}
            gridRowGap={8}
            flexWrap="wrap">
            {data ? (
              data.fetchUser.supporting.length > 0 ? (
                data.fetchUser.supporting.map(
                  (sup) =>
                    sup._id !== dataUser.user._id && (
                      <SupporterCard
                        image={sup.image}
                        key={sup._id}
                        name={sup._id as string}
                        href={`/user/${sup._id}`}
                      />
                    )
                )
              ) : (
                <Text>{data.fetchUser.name} is not supporting anyone.</Text>
              )
            ) : (
              dataUser &&
              (dataUser.user.supporting.length > 0 ? (
                dataUser.user.supporting.map(
                  (sup) =>
                    sup._id !== dataUser.user._id && (
                      <SupporterCard
                        image={sup.image}
                        key={sup._id}
                        name={sup.name}
                        href={`/user/${sup._id}`}
                      />
                    )
                )
              ) : (
                <Text>You are not supporting anyone.</Text>
              ))
            )}
          </Flex>
        );
      case "All Users":
        return (
          <Flex flexDir="column" gridGap={8}>
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              gridColumnGap={8}
              gridRowGap={8}
              flexWrap="wrap">
              {users &&
                users.users.map((user) => (
                  <SupporterCard
                    image={user.image}
                    key={user._id}
                    href={`/user/${user._id}`}
                    name={user.name}
                  />
                ))}
            </Flex>
            <Pagination users usersData={users} fetchMore={fetchMoreUsers} />
          </Flex>
        );
      default:
        return null;
    }
  };

  const HandleProfileFetch = () => {
    // router push
    router.push("/edit");
  };

  const HandlePayload = () => {
    switch (payload) {
      case "Supporting":
        return (
          <PostContainer>
            <ProfileTab
              active={active}
              setActive={(q) => setActive(q)}
              fields={["Posts", "Supporting"]}
            />
            <HandleRender />
          </PostContainer>
        );
      case "Support":
        return (
          <Flex
            h="40vh"
            flex={1}
            align="center"
            justify="center"
            overflow="hidden">
            <p>You must be supporting to view this content</p>
          </Flex>
        );
      default:
        return (
          <PostContainer>
            <ProfileTab
              active={active}
              setActive={(q) => setActive(q)}
              fields={["My Posts", "Feed", "Supporting", "All Users"]}
            />
            <HandleRender />
          </PostContainer>
        );
    }
  };

  /*
  Compare with the Payload
  */
  return loading || !id || loadingUser ? (
    <Loading />
  ) : (
    <Box>
      <Navbar />
      {dataUser && payload === "Edit Profile" && (
        <UserCard
          name={dataUser.user.name}
          image={dataUser.user.image}
          supporting={dataUser.user.supporting.length}
          supporters={dataUser.user.supporters.length}
          payload={payload}
          handleFetch={() => HandleProfileFetch()}
          href={`/user/${dataUser.user._id}`}
        />
      )}
      {data && data.fetchUser && (
        <UserCard
          image={data.fetchUser.image}
          name={data.fetchUser.name}
          supporting={data.fetchUser.supporting.length}
          supporters={data.fetchUser.supporters.length}
          payload={payload}
          handleFetch={() =>
            HandleSupportFetch(data.fetchUser._id, payload === "Support")
          }
          href={`/user/${data.fetchUser._id}`}
        />
      )}

      <HandlePayload />
    </Box>
  );
};

export default withApollo(User);
