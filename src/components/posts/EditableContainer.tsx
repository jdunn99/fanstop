import React from 'react';
import { Fade } from '@chakra-ui/transition';
import TextareaAutosize from 'react-textarea-autosize';
import { Textarea, Box, Flex, Tag } from '@chakra-ui/core';

interface EditableProps {
	value: string;
	type: string; // TODO: Convert to enum
	index: number;
	key: number;
	handleChange: (index: number, value: string) => void;
	handleDelete: (index: number) => void;
	handleFocus: (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.FocusEvent<HTMLTextAreaElement>
	) => void;
	small?: boolean;
}

export const EditableContainer: React.FC<EditableProps> = (props) => {
	// Determine what input type to return
	const handleType = () => {
		switch (props.type) {
			case 'title': {
				return (
					<span>
						<input
							name="name"
							type="text"
							className={
								props.small
									? 'preview-content-title'
									: 'editable-content-title'
							}
							onFocus={props.handleFocus}
							value={props.value}
							onChange={(e) =>
								props.handleChange(props.index, e.target.value)
							}
						/>
					</span>
				);
			}
			case 'text': {
				return (
					<Textarea
						name="name"
						className={
							props.small
								? 'preview-content-text'
								: 'editable-content-text'
						}
						color="gray.500"
						background="white"
						border="none"
						value={props.value}
						as={TextareaAutosize}
						onFocus={props.handleFocus}
						onChange={(e) =>
							props.handleChange(props.index, e.target.value)
						}
					/>
				);
			}
		}
	};

	return (
		<div key={props.key}>
			<Fade in={true}>
				{props.small ? (
					<Box p={4}>{handleType()}</Box>
				) : (
					<Box
						w="100%"
						my={3}
						mb={5}
						rounded="lg"
						border="1px solid rgba(0,0,0,0.1)"
					>
						<Flex p={2} maxH={200}>
							<Flex flex={1} m="auto" align="center" maxW={1000}>
								<Box>
									<Tag colorScheme="blue">
										Item {props.index + 1} -{' '}
										{props.type.charAt(0).toUpperCase() +
											props.type.slice(1)}
									</Tag>
								</Box>
								<Box ml="auto">
									<Tag
										px={4}
										colorScheme="red"
										cursor="pointer"
										onClick={() =>
											props.handleDelete(props.index)
										}
									>
										x
									</Tag>
								</Box>
							</Flex>
						</Flex>
						{handleType()}
					</Box>
				)}
			</Fade>
		</div>
	);
};
