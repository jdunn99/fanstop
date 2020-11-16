import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { Field } from '../Field';
import React from 'react';
import { BuildMap, useCreatePostMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';

interface SubmitPostProps {
	buildMap: BuildMap[];
}

export const SubmitPost: React.FC<SubmitPostProps> = ({ buildMap }) => {
	const [createPost] = useCreatePostMutation();
	const router = useRouter();

	return (
		<Box px={5}>
			<Formik
				initialValues={{ title: '', desc: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await createPost({
						variables: {
							title: values.title,
							desc: values.desc,
							buildMap: buildMap,
						},
					});
					if (response.data)
						router.push(
							`/user/${response.data.createPost.poster._id}/post/${response.data.createPost._id}`
						);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box mt={4}>
							<Field
								name="title"
								placeholder="Title"
								label="Title"
								type="text"
							/>
						</Box>
						<Box mt={4}>
							<Field
								name="desc"
								placeholder="Description"
								label="Description"
								textarea
							/>
						</Box>
						<Box textAlign="center">
							<Button
								mt={8}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="blue"
							>
								Submit
							</Button>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
};
