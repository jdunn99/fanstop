import { Flex, Text, Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { useRegisterMutation } from "../generated/graphql";
import router from "next/router";
import { withApollo } from "../util/withApollo";
import { Field } from "../components/Field";
import { Container } from "../components/Container";
import { InputWrapper } from "../components/InputWrapper";

/** Type Definitions */
interface RegisterProps {}

type SubmittedValues = {
  name: string;
  bio: string;
  email: string;
  password: string;
  confirm_password: string;
};

/**
 * 
 * @returns (
    <Container min="90vh">
      <InputWrapper heading="Log In" w={400}>
        <InputControl />
      </InputWrapper>
    </Container>
  );
 */
const Register: React.FC<RegisterProps> = () => {
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [register] = useRegisterMutation();
  /**
   * Submits our values to the server - attempts to register.
   * @param {SubmittedValues} values - The values sent to the server.
   */
  const onSubmit = async (values: SubmittedValues) => {
    setSubmitting(true);

    /** Registers a User */
    const response = await register({
      variables: {
        name: values.name,
        email: values.email,
        password: values.password,
        bio: values.bio,
      },
    });

    setSubmitting(false);
    if (response.data?.register.errors) {
    } else {
      router.push(`/login`);
    }
  };

  /**
   * Component to handle styling of the Input
   */
  const InputControl = () => {
    return (
      <Formik
        initialValues={{
          email: "",
          password: "",
          bio: "",
          name: "",
          confirm_password: "",
        }}
        onSubmit={onSubmit}>
        <Form>
          <Box mt={4}>
            <Field
              name="name"
              placeholder="name"
              label="Name"
              required
              type="text"
            />
          </Box>
          <Box mt={4}>
            <Field
              name="email"
              placeholder="email"
              label="Email"
              required
              type="email"
            />
          </Box>
          <Box mt={4}>
            <Field
              name="password"
              placeholder="password"
              label="Password"
              required
              type="password"
            />
          </Box>
          <Box mt={4}>
            <Field
              name="confirm_password"
              placeholder="confirm password"
              required
              label="Confirm Password"
              type="password"
            />
          </Box>
          <Box mt={4}>
            <Field
              name="bio"
              placeholder="bio"
              label="Bio"
              type="text"
              textarea
            />
          </Box>
          <Box mt={2}>
            <Text fontSize="sm">
              Already have an account?{" "}
              <a style={{ color: "#3182ce" }} href="/register">
                Sign In.
              </a>
            </Text>
          </Box>
          <Box textAlign="center">
            <Button
              mt={8}
              type="submit"
              isLoading={submitting}
              colorScheme="blue">
              Register
            </Button>
          </Box>
        </Form>
      </Formik>
    );
  };

  return (
    <Container>
      <InputWrapper heading="Register">
        <InputControl />
      </InputWrapper>
    </Container>
  );
};

export default withApollo(Register);
