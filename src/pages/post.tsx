import React from "react";
import { useRouter } from "next/router";
import {
  useUserQuery,
  BuildMap,
  useCreatePostMutation,
  UserQuery,
  UserDocument,
} from "../generated/graphql";
import { Box, Flex, Button, Spinner, Input } from "@chakra-ui/core";
import Head from "next/head";
import { Navbar } from "../components/Navbar";
import { withApollo } from "../util/withApollo";
import { PostView } from "../components/posts/PostView";
import { PostEdit } from "../components/posts/PostEdit";
import { BuildType } from "../util/types";
import { Loading } from "../components/Loading";

interface indexProps {}
/**
 * Creates a Post and saves it on the server.
 * @returns
 */
const Post: React.FC<indexProps> = () => {
  /** State */
  const [title, setTitle] = React.useState<string>("Title");
  const [desc, setDesc] = React.useState<string>("Description");
  const [buildState, setBuildState] = React.useState<BuildMap[]>([]);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  const [createPost] = useCreatePostMutation();

  /** Misc Variables */
  const router = useRouter();

  /** GraphQL */
  const { data, loading } = useUserQuery();

  /** useEffect Hooks */
  React.useEffect(() => {
    if (!loading && !data.user) router.push("/login");
  }, [loading]);

  /** Util Functions */

  /**
   * Updates the buildState when changing an Input
   * @param {number} index - The index being changed
   * @param {string} value - The value to change the index to
   */
  const handleChange = (index: number, value: string) => {
    const _build = [...buildState];
    _build[index]["value"] = value;

    setBuildState(_build);
  };

  /**
   * Helper function to change our Input focus to whatever is selected
   * @param event - The event sent from our Element
   * @returns () => void
   */
  const handleFocus = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => event.target.select();

  /**
   * Deletes the specific index from the buildMap
   * @param {number} index - The index being deleted
   */
  const handleDelete = (index: number) => {
    const _build = [...buildState];

    if (index === 0) _build.shift();
    else _build.splice(index, 1);

    setBuildState(_build);
  };

  /**
   * Inserts a new item into the buildMap
   * @param {number} index - The index to be inserted at
   * @param {BuildType} item - The type of item being inserted
   */
  const handleInsert = (index: number, item: BuildType) => {
    const _build = [...buildState];

    if (buildState.length === 0) _build.push(item);
    else _build.splice(index + 1, 0, item);

    setBuildState(_build);
  };

  /**
   * Submits a post to the server. If successful, reroutes to that post.
   */
  const submitPost = async () => {
    const response = await createPost({
      variables: {
        title: title,
        desc: desc,
        buildMap: buildState,
      },
      update: (cache, { data: postData }) => {
        cache.writeQuery<UserQuery>({
          query: UserDocument,
          data: {
            __typename: "Query",
            user: {
              ...data.user,
              posts: [postData.createPost, ...data.user.posts],
            },
          },
        });
      },
    });
    if (response.data)
      router.push(`/user/${response.data.createPost.poster._id}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <Head>
        <title>FanStop - Create Post</title>
      </Head>
      <Navbar />

      <Flex flex={1} overflow="hidden" flexDir="column">
        <Flex
          gridColumnGap={6}
          align="center"
          p={4}
          maxW={1100}
          mt="4rem"
          mx="auto">
          <Box>
            <Input
              border="none"
              fontSize="20px"
              fontWeight={600}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              border="none"
              mt={2}
              fontSize="16px"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Box>
          <Flex gridColumnGap={4} ml="auto">
            <Button onClick={() => setPreview(!preview)}>
              {preview ? "Preview" : "Edit"}
            </Button>
            <Button onClick={submitPost} colorScheme="blue">
              Submit
            </Button>
          </Flex>
        </Flex>
        {preview ? (
          <PostView buildState={buildState} />
        ) : (
          <PostEdit
            buildState={buildState}
            handleChange={handleChange}
            handleDelete={handleDelete}
            handleFocus={handleFocus}
            handleInsert={handleInsert}
            index={index}
            setIndex={(q) => setIndex(q)}
          />
        )}
      </Flex>
    </>
  );
};

export default withApollo(Post);
