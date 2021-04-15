import { Flex, Heading, Box, Button, FormLabel, Avatar } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import {
  UserQuery,
  UserDocument,
  useLoginMutation,
  useUserQuery,
} from "../generated/graphql";
import router from "next/router";
import { withApollo } from "../util/withApollo";
import { Field } from "../components/Field";
import { Container } from "../components/Container";
import { InputWrapper } from "../components/InputWrapper";
import { Navbar } from "../components/Navbar";
import { ValuesOfCorrectTypeRule } from "graphql";
import { isServer } from "../util/isServer";
import { Loading } from "../components/Loading";

interface EditProps {}

const Edit: React.FC<EditProps> = () => {
  const { data, loading } = useUserQuery({ skip: isServer() });
  /**
   * Component to handle styling of the Input
   */
  const InputControl = () => {
    return (
      <Formik
        initialValues={{ name: data.user.name, bio: "" }}
        onSubmit={() => {}}>
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
            <Field
              style={{ border: "none", flex: "25%" }}
              type="file"
              name="a"
              label="Profile Image"
            />
            <Avatar
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F3%2F39%2FDomestic_Goose.jpg&f=1&nofb=1"
              size="xl"
            />
          </Flex>
          <Flex mt={8} gridColumnGap={2} justify="center">
            <Button>Cancel</Button>
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
