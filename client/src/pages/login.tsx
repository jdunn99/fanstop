import { Flex, Heading, Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import {
  UserQuery,
  UserDocument,
  useLoginMutation,
} from "../generated/graphql";
import router from "next/router";
import { withApollo } from "../util/withApollo";
import { Field } from "../components/Field";
import { Container } from "../components/Container";
import { InputWrapper } from "../components/InputWrapper";

/** Type Definitions */
interface LoginProps {}
type SubmittedValues = {
  email: string;
  password: string;
};

/**
 * Logs in the User with JWTs.
 * @returns (
    <Container min="90vh">
      <InputWrapper heading="Log In" w={400}>
        <InputControl />
      </InputWrapper>
    </Container>
  );
 */
const Login: React.FC<LoginProps> = () => {
  const [login] = useLoginMutation();
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  /**
   * Submits our values to the server - attempts to log in user.
   * @param {SubmittedValues} values - The values sent to the server.
   */
  const onSubmit = async (values: SubmittedValues) => {
    setSubmitting(true);

    /** Log in the User and update the cache. */
    const response = await login({
      variables: {
        email: values.email,
        password: values.password,
      },
      update: (cache, { data }) => {
        cache.writeQuery<UserQuery>({
          query: UserDocument,
          data: {
            __typename: "Query",
            user: data?.login.user,
          },
        });
      },
    });
    setSubmitting(false);
    if (response.data?.login.errors) {
    } else {
      router.push(`/user/${response.data.login.user._id}`);
    }
  };

  /**
   * Component to handle styling of the Input
   */
  const InputControl = () => {
    return (
      <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit}>
        <Form>
          <Box mt={4}>
            <Field
              name="email"
              placeholder="email"
              label="Email"
              type="email"
            />
          </Box>
          <Box mt={4}>
            <Field
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
          </Box>
          <Box textAlign="center">
            <Button
              mt={8}
              type="submit"
              isLoading={submitting}
              colorScheme="blue">
              Sign In
            </Button>
          </Box>
        </Form>
      </Formik>
    );
  };

  return (
    <Container min="90vh">
      <InputWrapper heading="Log In" w={[300, 350, 400]}>
        <InputControl />
      </InputWrapper>
    </Container>
  );
};

export default withApollo(Login);
