import { Flex, Heading, Box, Button, FormLabel, Avatar } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import {
  UserQuery,
  UserDocument,
  useUserQuery,
  useUpdateUserMutation,
} from "../generated/graphql";
import router from "next/router";
import { withApollo } from "../util/withApollo";
import { Field } from "../components/Field";
import { Container } from "../components/Container";
import { InputWrapper } from "../components/InputWrapper";
import { isServer } from "../util/isServer";
import { Loading } from "../components/Loading";
interface EditProps {}

const Edit: React.FC<EditProps> = () => {
  const [image, setImage] = React.useState<File>();
  const [url, setUrl] = React.useState<string>("");

  const [updateUser] = useUpdateUserMutation();

  React.useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const { data, loading } = useUserQuery({ skip: isServer() });

  React.useEffect(() => {
    if (data && data.user.image) setUrl(data.user.image);
  }, [data]);

  const uploadImage = async (): Promise<string> => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "wmkodhh9");
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/de0iugw9w/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const json = await response.json();
    return Promise.resolve(json.secure_url);
  };

  /**
   * Component to handle styling of the Input
   */
  const InputControl = () => {
    return (
      <Formik
        initialValues={{ name: data.user.name, bio: data.user.bio }}
        onSubmit={async (values) => {
          const image = await uploadImage();
          await updateUser({
            variables: {
              name: values.name,
              bio: values.bio,
              image,
            },
            update: (cache, { data: updatedData }) => {
              console.log("firing !");
              cache.writeQuery<UserQuery>({
                query: UserDocument,
                data: {
                  __typename: "Query",
                  user: {
                    ...data.user,
                    name: updatedData.updateUser.user.name,
                    bio: updatedData.updateUser.user.bio,
                    image: updatedData.updateUser.user.image,
                  },
                },
              });
            },
          });
          router.push(`/user/${data.user._id}`);
        }}>
        <Form>
          <Box mt={4}>
            <Field name="name" placeholder="Name" label="Name" type="text" />
          </Box>
          <Box mt={4}>
            <Field
              textarea
              name="bio"
              placeholder="Bio"
              label="Bio"
              type="text"
            />
          </Box>
          <Flex mt={6} align="center">
            <input
              style={{ color: "white" }}
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                file ? setImage(file) : setImage(null);
              }}
            />
            <Avatar src={url} size="xl" />
          </Flex>
          <Flex mt={8} gridColumnGap={2} justify="center">
            <Button onClick={() => router.push("/")}>Cancel</Button>
            <Button type="submit" isLoading={false} colorScheme="blue">
              Submit
            </Button>
          </Flex>
        </Form>
      </Formik>
    );
  };
  return loading || !data ? (
    <Loading />
  ) : (
    <Container>
      <InputWrapper heading="Edit Profile">
        {data.user && <InputControl />}
      </InputWrapper>
    </Container>
  );
};

export default withApollo(Edit);
