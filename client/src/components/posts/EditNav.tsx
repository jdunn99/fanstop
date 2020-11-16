import {
	Stack,
	Popover,
	PopoverTrigger,
	Button,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
	Box,
	Tag,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Flex,
	useDisclosure,
} from '@chakra-ui/core';
import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { BuildType } from '../util/types';
import { EditableContainer } from './EditableContainer';

interface EditNavProps {
	buildState: BuildType[];
	handleChange: (index: number, value: string) => void;
	handleDelete: (index: number) => void;
	handleFocus: (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.FocusEvent<HTMLTextAreaElement>
	) => void;
	handleInsert: (index: number, item: BuildType) => void;
	index: number;
	setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const EditNav: React.FC<EditNavProps> = ({
	buildState,
	handleChange,
	handleDelete,
	handleFocus,
	handleInsert,
	index,
	setIndex,
}) => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	const InsertModal = () => {
		return (
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Insert Item</ModalHeader>
					<ModalBody textAlign="center">
						<Button
							mx={1}
							onClick={() => {
								onClose();
								handleInsert(index, {
									type: 'title',
									value: 'Sample Title',
								});
							}}
						>
							Title
						</Button>
						<Button
							mx={1}
							onClick={() => {
								onClose();
								handleInsert(index, {
									type: 'text',
									value: 'Sample text',
								});
							}}
						>
							Text
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	};

	return (
		<Stack px={5}>
			{buildState.map((x, i) => (
				<>
					<Flex align="center" justify="space-between">
						<Box w="85%">
							<Popover placement="left" isLazy>
								{({ onClose }) => (
									<>
										<PopoverTrigger>
											<Button w="100%">
												Item {i + 1} - {x.type}
											</Button>
										</PopoverTrigger>
										<PopoverContent
											mb={3}
											background="gray.100"
										>
											<PopoverArrow />
											<PopoverBody>
												<Box align="left" ml={4}>
													<Tag colorScheme="green">
														Edit
													</Tag>
												</Box>
												<EditableContainer
													handleChange={handleChange}
													handleDelete={handleDelete}
													handleFocus={handleFocus}
													index={i}
													key={i}
													type={x.type}
													value={x.value}
													small
												/>
												<Tag
													px={4}
													colorScheme="red"
													cursor="pointer"
													onClick={() => {
														onClose();
														handleDelete(i);
													}}
												>
													x
												</Tag>
											</PopoverBody>
										</PopoverContent>
									</>
								)}
							</Popover>
						</Box>
						<Button
							px={4}
							colorScheme="red"
							cursor="pointer"
							onClick={() => {
								onClose();
								handleDelete(i);
							}}
						>
							x
						</Button>
					</Flex>
					<Button
						px={4}
						onClick={() => {
							setIndex(i);
							onOpen();
						}}
					>
						<FaPlusCircle color="#38A169" />
					</Button>
				</>
			))}
			<InsertModal />
		</Stack>
	);
};
