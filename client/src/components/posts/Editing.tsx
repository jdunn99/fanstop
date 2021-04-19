import React from "react";
import { Box, Flex, Button, Input, Textarea } from "@chakra-ui/core";
import { FaCheck, FaPencilAlt } from "react-icons/fa";

import {
  FetchPostQuery,
  useDeletePostMutation,
  UserDocument,
  UserQuery,
  useUpdatePostMutation,
} from "../../generated/graphql";
import TextareaAutosize from "react-textarea-autosize";
import { PostCard } from "../PostCard";

interface EditButtonsProps {
  id: string;
  dataUser: UserQuery;
  editing?: boolean;
  setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  newTitle?: string;
  newDesc?: string;
}

export const EditButtons: React.FC<EditButtonsProps> = ({
  id,
  dataUser,
  newTitle,
  newDesc,
  editing,
  setEditing,
}) => {
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const handleDelete = async (id: string) => {
    await deletePost({
      variables: {
        id,
      },
      update: (cache, { data: deletedPostData }) => {
        const newPosts = dataUser.user.posts.filter(({ _id }) => {
          return _id !== id;
        });
        if (!deletedPostData.deletePost) return;
        cache.writeQuery<UserQuery>({
          query: UserDocument,

          data: {
            __typename: "Query",
            user: {
              ...dataUser.user,
              posts: newPosts,
            },
          },
        });
      },
    });
  };

  const handleSubmit = async (id: string) => {
    await updatePost({
      variables: {
        id,
        title: newTitle,
        desc: newDesc,
      },
      update: (cache, { data: updatedPostData }) => {
        const updatedPosts = dataUser.user.posts.map((post) => {
          if (post._id === id)
            post = {
              ...post,
              title: updatedPostData.updatePost.title,
              desc: updatedPostData.updatePost.desc,
            };
          return post;
        });
        cache.writeQuery<UserQuery>({
          query: UserDocument,
          data: {
            __typename: "Query",
            user: {
              ...dataUser.user,
              posts: updatedPosts,
            },
          },
        });
      },
    });
    setEditing(false);
  };

  return editing ? (
    <Flex flexDir="column" gridGap={2}>
      <Button
        size="sm"
        title="Submit"
        colorScheme="green"
        onClick={() => {
          handleSubmit(id);
        }}>
        <FaCheck />
      </Button>
      <Button size="sm" title="Undo Changes" onClick={() => setEditing(false)}>
        x
      </Button>
    </Flex>
  ) : (
    <Flex flexDir="column" gridGap={2}>
      <Button
        size="sm"
        title="Edit Post"
        colorScheme="blue"
        onClick={() => setEditing(true)}>
        <FaPencilAlt />
      </Button>
      <Button
        onClick={() => handleDelete(id)}
        size="sm"
        title="Delete Post"
        colorScheme="red">
        x
      </Button>
    </Flex>
  );
};

interface EditCardProps {
  title: string;
  text: string;
  href?: string;
  author?: string;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  setDesc?: React.Dispatch<React.SetStateAction<string>>;
}
export const EditCard: React.FC<EditCardProps> = ({
  title,
  text,
  setTitle,
  setDesc,
}) => {
  const styles = {
    title: {
      fontWeight: 700,
      lineHeight: 1.5,
      opacity: 0.8,
      fontSize: "1.875rem",
    },
    text: {
      lineHeight: 1.5,
      color: "#718096",
    },
  };

  return (
    <Box>
      <Box
        w={[300, 450, 600]}
        m="auto"
        background="#EDF2F7"
        p={4}
        rounded="lg"
        style={{ cursor: "pointer" }}
        _hover={{ background: "#E2E8F0" }}>
        <Input
          style={styles.title}
          defaultValue={title}
          my={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          as={TextareaAutosize}
          style={styles.text}
          onChange={(e) => setDesc(e.target.value)}
          defaultValue={text}
        />
      </Box>
    </Box>
  );
};

type EditableProps = EditCardProps & EditButtonsProps;

export const Editable: React.FC<EditableProps> = ({
  title,
  text,
  href,
  id,
  dataUser,
}) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [newTitle, setNewTitle] = React.useState<string>(title);
  const [newDesc, setNewDesc] = React.useState<string>(text);

  return (
    <Flex align="center" gridGap={4}>
      {editing ? (
        <EditCard
          title={newTitle}
          text={newDesc}
          setTitle={(q) => setNewTitle(q)}
          setDesc={(q) => setNewDesc(q)}
          href={href}
        />
      ) : (
        <PostCard title={title} text={text} href={href} />
      )}

      <EditButtons
        editing={editing}
        newTitle={newTitle}
        newDesc={newDesc}
        setEditing={(q) => setEditing(q)}
        id={id}
        dataUser={dataUser}
      />
    </Flex>
  );
};
